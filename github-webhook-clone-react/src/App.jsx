import "./App.css";
import { useState } from "react";
import axios from "axios";

const eventsList = [
  {
    key: "COMMIT",
    title: "Commit",
    checked: true,
  },
  {
    key: "PUSH",
    title: "Push",
    checked: false,
  },
  {
    key: "MERGE",
    title: "Merge",
    checked: false,
  },
];

function App() {
  const [formData, setFormData] = useState({
    payloadUrl: "",
    secret: "",
    eventTypes: [...eventsList],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("/api/webhooks", {
      ...formData,
      eventTypes: formData.eventTypes
        .filter((item) => item.checked)
        .map((item) => item.key),
    });
  };

  const handleFormChange = (e, key) => {
    if (e.target.name === "eventTypes") {
      setFormData((prev) => {
        const checkboxes = prev[e.target.name].map((item) => {
          return {
            ...item,
            checked: item.key === key ? e.target.checked : item.checked,
          };
        });
        return {
          ...prev,
          [e.target.name]: checkboxes,
        };
      });
      return;
    }
    setFormData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleEventHappened = (key) => {
    axios.post("/api/event-emulate", {
      type: key,
      data: { eventType: key, initiator: "Huzaifa" },
    });
  };

  return (
    <>
      <div className="App">
        <h1 className="text-3xl font-bold text-center py-4">
          My GitHub (Repo)
        </h1>
        <div className="container mx-auto">
          <h1 className="text-xl">Register a webhook</h1>
          <form className="mt-16" onSubmit={handleSubmit}>
            <div>
              <label className="block" htmlFor="payloadUrl">
                Webhook Url
              </label>
              <input
                onChange={handleFormChange}
                value={formData.payloadUrl}
                name="payloadUrl"
                type="text"
                id="payloadUrl"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-4">
              <label className="secret" htmlFor="url">
                Secret Key
              </label>
              <input
                onChange={handleFormChange}
                value={formData.secret}
                name="secret"
                type="text"
                id="secret"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mt-4">
              <h3 className="font-bold mb-2">Trigger webhook on events</h3>
              {eventsList.map((item) => {
                return (
                  <div key={item.key}>
                    <input
                      onChange={(e) => {
                        handleFormChange(e, item.key);
                      }}
                      defaultChecked={item.checked}
                      value={item.checked}
                      name="eventTypes"
                      id={item.key}
                      type="checkbox"
                    />
                    <label className="ml-2" htmlFor={item.key}>
                      {item.title}
                    </label>
                  </div>
                );
              })}
            </div>
            <button
              className="mt-4 bg-purple-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-purple-600 active:bg-purple-700 active:scale-95 transition-all duration-150"
              type="submit"
            >
              <span>Register Webhook</span>
            </button>
          </form>

          <div className="mt-12">
            <h2>Emulate Events</h2>
            <div className="flex items-center gap-4">
              {eventsList.map((eventType) => {
                return (
                  <button
                    key={eventType.key}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-green-600 active:bg-green-700 active:scale-95 transition-all duration-150"
                    onClick={() => {
                      handleEventHappened(eventType.key);
                    }}
                  >
                    {eventType.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
