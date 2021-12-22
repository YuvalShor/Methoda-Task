import React, { useState } from "react";

const AddTransition = ({ statuses, addNewTransition }) => {
  const [newTransition, setNewTransition] = useState({
    name: "",
    from: "",
    to: "",
  });

  const handleNewTransitionFormChange = (e) => {
    setNewTransition({ ...newTransition, [e.target?.name]: e.target?.value });
  };

  const addTransition = (e) => {
    e.preventDefault();
    console.log("New Transition:", newTransition);
    addNewTransition(newTransition, setNewTransition);

    /* reset the new transition form */
    document.getElementById("add-transition-form").reset();
    setNewTransition((prevState) => ({
      name: "",
      from: { ...prevState.from },
      to: { ...prevState.to },
    }));
  };

  return (
    <div className="add-transition">
      <form id="add-transition-form">
        <input
          type="text"
          name="name"
          placeholder="New transition name"
          onChange={handleNewTransitionFormChange}
          value={newTransition.name}
        />
        <select
          name="from"
          defaultValue=""
          onChange={handleNewTransitionFormChange}
        >
          <option hidden={true} value="" disabled>
            Choose From
          </option>
          {statuses.map((status) => {
            return (
              <option key={status.name} value={status.name}>
                {status.name}
              </option>
            );
          })}
        </select>
        <select
          name="to"
          defaultValue=""
          onChange={handleNewTransitionFormChange}
        >
          <option hidden={true} value="" disabled>
            Choose To
          </option>
          {statuses.map((status) => {
            if (status.name === newTransition.from) {
              return null;
            }
            return (
              <option key={status.name} value={status.name}>
                {status.name}
              </option>
            );
          })}
        </select>
        <button className="button-add-transition" onClick={addTransition}>
          Add new transition
        </button>
      </form>
    </div>
  );
};

export default AddTransition;
