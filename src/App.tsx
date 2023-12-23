import { useEffect, useState } from "react";
import {
  COLLECTION_ID_MESSAGE,
  DATABASE_ID,
  database,
} from "./services/appWriteConfig";
import { ID, Query } from "appwrite";
import { Spinner } from "./components/Spinner";

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
                <div>
                  <span className="bg-pink-600 rounded-3xl px-4 py-2">
                    {message.body}
                  </span>
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
