import { useEffect, useState } from "react";
import {
  COLLECTION_ID_MESSAGE,
  DATABASE_ID,
  database,
} from "./services/appWriteConfig";
import { ID, Query } from "appwrite";
import { Spinner } from "./components/Spinner";
import { motion } from "framer-motion";

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

function App() {
  const [message, setMessage] = useState<DataBaseProps[]>([]);
  const [messageBody, setMessageBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteIsLoading, setDeleteIsLoading] = useState(false);

  const getMessage = async () => {
    const response: any = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID_MESSAGE,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    setMessage(response.documents);
  };

  const handleSubmit = async (e: InputEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = {
      body: messageBody,
    };
    console.log(payload);

    await database
      .createDocument(DATABASE_ID, COLLECTION_ID_MESSAGE, ID.unique(), payload)
      .finally(() => {
        setIsLoading(false);
      });

    setMessageBody("");
  };

  const deleteMessage = async (message_id: string) => {
    setDeleteIsLoading(true);
    const response = await database
      .deleteDocument(DATABASE_ID, COLLECTION_ID_MESSAGE, message_id)
      .then((res) => res)
      .finally(() => {
        setDeleteIsLoading(false);
      });

    console.log(response);
  };

  useEffect(() => {
    getMessage();
  }, [message]);

  return (
    <main className="bg-gray-950 h-screen w-screen  flex items-center justify-center text-pink-100">
      <div
        className={` p-10 max-w-[40rem] w-full h-[40rem] rounded-b-2xl  border border-white/10 bg-gray-900 transition duration-150 hover:bg-gray-800`}
      >
        <form className="mb-10" onSubmit={(e: any) => handleSubmit(e)}>
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
              className={`${
                isLoading && "bg-yellow-600"
              } bg-blue-300 text-gray-950 px-2 py-1 rounded-lg flex items-center gap-2`}
            >
              <span>Send</span>
              {isLoading && <Spinner />}
            </button>
          </div>
        </form>
        <div className={` max-h-[26rem] h-full overflow-y-auto`}>
          {message?.map((message) => {
            return (
              <div key={message.$id} className="flex flex-col gap-4 mb-10">
                <div>
                  <p>{message.$createdAt}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="bg-pink-600 rounded-3xl px-4 py-2">
                    {message.body}
                  </span>

                  <motion.div
                    onClick={() => deleteMessage(message.$id)}
                    className="cursor-pointer w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center"
                    animate={
                      deleteIsLoading ? { y: [-10, 0, -10] } : { y: [0, 0, 0] }
                    }
                    transition={{
                      duration: 1,
                      repeat: deleteIsLoading ? Infinity : 0,
                      ease: "linear",
                    }}
                  >
                    X
                  </motion.div>

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

export default App;
