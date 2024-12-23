import { useState } from "react";

const Tab = ({ description }: { description: string }) => {
  const [activeTab, setActiveTab] = useState<string>("About");

  return (
    <div>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 border-none dark:text-gray-400 dark:border-gray-700 ">
        <ul className="flex flex-wrap -mb-px">
          <li className="me-2">
            <p
              onClick={() => setActiveTab("About")}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                activeTab === "About"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              About
            </p>
          </li>
          <li className="me-2">
            <p
              onClick={() => setActiveTab("Review")}
              className={`inline-block p-4 border-b-2 rounded-t-lg cursor-pointer ${
                activeTab === "Review"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
              }`}
            >
              Review
            </p>
          </li>
        </ul>
      </div>
      <div className="p-4 transition-all duration-300 ease-in-out">
        {activeTab === "About" && (
          <div className="grid grid-cols-1 gap-10">
            <div>{description}</div>
          </div>
        )}
        {activeTab === "Review" && (
          <div>
            <h2>Review Tab</h2>
            <p>Nội dung ngẫu nhiên cho Review.</p>

            <div>
              <img
                src="https://www.phucanh.vn/media/news/0208_kinh-nghiem-chon-laptop-cho-ke-toan.jpg"
                alt=""
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tab;
