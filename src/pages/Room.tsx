import { ID, Query } from "appwrite";
import { useEffect, useState } from "react";
import client, {
  COLLECTION_ID_MESSAGE,
  DATABASE_ID,
  database,
} from "../services/appWriteConfig";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Spinner } from "../components/Spinner";

export interface DataBaseProps {
  body: string;
  userId: string;
  username: string;
  $id: string;
  $createdAt: string;
  $updatedAt: Date;
  $permissions: [];
  $databaseId: string;
  $collectionId: string;
}
export default function Room() {
  const [message, setMessage] = useState<DataBaseProps[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getMessage = async () => {
    const response: any = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    setMessage(response.documents);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      body: messageBody,
    };

    await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      ID.unique(),
      payload
    );
    // setMessage(() => [response, ...message]);
    setMessageBody("");
  };

  const deleteMessage = async (message_id: string) => {
    const response = await database.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      message_id
    );

    // setMessage(() => message.filter((message) => message.$id !== message_id));
  };

  useEffect(() => {
    getMessage();

    //Subscribe to files channel
    client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID_MESSAGE}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE CREATED");
          setMessage((prevState: any) => [response.payload, ...prevState]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE DELETED");
          setMessage((prevState: any) =>
            prevState.filter(
              (message: any) => message.$id !== response.payload.$id
            )
          );
        }
      }
    );

    // return () => {
    //   unsubscribe();
    // };
  }, []);
  return (
    <main className="bg-gray-950 h-screen w-screen  flex items-center justify-center text-pink-100">
      <div
        className={` p-10 max-w-[40rem] w-full h-[40rem] rounded-b-2xl  border border-white/10 bg-gray-900 transition duration-150 hover:bg-gray-800`}
      >
        <form className="mb-10" onSubmit={handleSubmit}>
          <div>
            <textarea
              name=""
              required
              maxLength={1000}
              placeholder="Say something..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
              className="w-full text-gray-950 rounded-lg p-2"
            ></textarea>
          </div>
          <div className=" flex justify-end">
            <button
              type="submit"
              className={`bg-blue-300 text-gray-950 px-2 py-1 rounded-lg flex items-center gap-2`}
            >
              <span>Send</span>
              {isLoading && <Spinner />}
            </button>
          </div>
        </form>
        <div className={` max-h-[26rem] h-full overflow-y-auto`}>
          {message?.map((message) => {
            return (
              <div
                key={message.$createdAt}
                className="flex flex-col gap-4 mb-10"
              >
                <div>
                  <p>{format(message.$createdAt, "dd/MM/yyyy HH:mm")}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-pink-600 rounded-3xl px-4 py-2">
                    {message.body}
                  </span>

                  <button onClick={() => deleteMessage(message.$id)}>
                    <Trash2 className="text-white w-6 h-6 transition duration-150 hover:text-pink-600 " />
                  </button>

                  {/* <motion.div
                    transition={{ ease: "linear", duration: 0.8 }}
                    onTransitionEnd={!isLoading}
                    className="bg-gray-700 text-white rounded-full h-6 w-6 flex items-center justify-center mx-10"
                    onClick={() => deleteMessage(message.$id)}
                  >
                    x
                  </motion.div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
