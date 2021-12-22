const TransitionList = ({ transitions, deleteTransition }) => {
  return (
    <div className='transition-list-container'>
      <h2>Transitions</h2>
      <table className='transition-table'>
        <tbody>
          <tr>
            <th>Transition Name</th>
            <th>From</th>
            <th>To</th>
            <th>Delete Transition</th>
          </tr>
          {transitions.map((transition) => {
            return (
              <tr key={transition.name}>
                <td>{transition.name}</td>
                <td>{transition.from}</td>
                <td>{transition.to}</td>
                <td>
                  <button
                    className='button-delete'
                    onClick={() => {
                      deleteTransition(transition);
                    }}
                  >
                    Delete transition
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransitionList;
