import React from "react";
import { footerData } from "../../constants/mockupdata";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-4">
      <div className="container mx-auto px-32">
        <div className="text-center mb-1">
          <ul className="flex flex-wrap items-start gap-4">
            <li className="flex-1 ">
              <h1 className="text-2xl font-bold mb-1 leading-tight">
                {footerData.newsletter.title}
              </h1>
              
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px- footer-columns">
          {footerData.columns.map((column, index) => (
            <div key={index} className="footer-column">
              <h4 className="text-lg font-semibold mb-1 leading-tight">
                {column.title}
              </h4>
              <ul className="space-y-1 text-gray-400 leading-tight">
                {column.items
                  ? column.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))
                  : column.details.map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 border-t border-gray-700 p-1">
          <p className="text-gray-500 leading-tight">&copy; 2025 TechApp</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
