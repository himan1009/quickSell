import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import "./App.css";
import List from "./Components/List/List";
import Navbar from "./Components/Navbar/Navbar";

function App() {
  const statusListArray = [
    "In progress",
    "Backlog",
    "Todo",
    "Done",
    "Cancelled",
  ];
  const userListArray = [
    "Anoop sharma",
    "Yogesh",
    "Shankar Kumar",
    "Ramesh",
    "Suresh",
  ];
  const priorityListArray = [
    { name: "No priority", priority: 0 },
    { name: "Low", priority: 1 },
    { name: "Medium", priority: 2 },
    { name: "High", priority: 3 },
    { name: "Urgent", priority: 4 },
  ];

  const [selectedGroupValue, setSelectedGroupValue] = useState(
    getSavedStateFromLocalStorage() || "status"
  );
  const [selectedOrderValue, setSelectedOrderValue] = useState("title");
  const [ticketDetailsArray, setTicketDetailsArray] = useState([]);

  const orderTicketDataByValue = useCallback(
    async (ticketsArray) => {
      if (selectedOrderValue === "priority") {
        ticketsArray.sort((a, b) => b.priority - a.priority);
      } else if (selectedOrderValue === "title") {
        ticketsArray.sort((a, b) => a.title.localeCompare(b.title));
      }
      setTicketDetailsArray(ticketsArray);
    },
    [selectedOrderValue]
  );

  function saveStateToLocalStorage(stateToSave) {
    localStorage.setItem("groupValue", JSON.stringify(stateToSave));
  }

  function getSavedStateFromLocalStorage() {
    const savedState = localStorage.getItem("groupValue");
    return savedState ? JSON.parse(savedState) : null;
  }

  useEffect(() => {
    saveStateToLocalStorage(selectedGroupValue);

    const fetchAndProcessData = async () => {
      const response = await axios.get(
        "https://api.quicksell.co/v1/internal/frontend-assignment "
      );
      if (response.status === 200) {
        const ticketArray = response.data.tickets.map((ticket) => ({
          ...ticket,
          userObj: response.data.users.find(
            (user) => user.id === ticket.userId
          ),
        }));
        setTicketDetailsArray(ticketArray);
        orderTicketDataByValue(ticketArray);
      }
    };

    fetchAndProcessData();
  }, [orderTicketDataByValue, selectedGroupValue]);

  return (
    <>
      <Navbar
        groupValue={selectedGroupValue}
        orderValue={selectedOrderValue}
        handleGroupValue={setSelectedGroupValue}
        handleOrderValue={setSelectedOrderValue}
      />
      <section className="board-details">
        <div className="board-details-list">
          {
            {
              status: statusListArray.map((status) => (
                <List
                  key={status}
                  groupValue="status"
                  orderValue={selectedOrderValue}
                  listTitle={status}
                  ticketDetails={ticketDetailsArray}
                />
              )),
              user: userListArray.map((user) => (
                <List
                  key={user}
                  groupValue="user"
                  orderValue={selectedOrderValue}
                  listTitle={user}
                  ticketDetails={ticketDetailsArray}
                />
              )),
              priority: priorityListArray.map((priority) => (
                <List
                  key={priority.priority}
                  groupValue="priority"
                  orderValue={selectedOrderValue}
                  listTitle={priority.priority}
                  ticketDetails={ticketDetailsArray}
                />
              )),
            }[selectedGroupValue]
          }
        </div>
      </section>
    </>
  );
}

export default App;
