const StatusList = ({ statuses, deleteStatus, changeInitialStatus }) => {
  const changeInitial = (e) => {
    changeInitialStatus(e.target?.id);
  };

  return (
    <div className='status-list-container'>
      <h2>Statuses</h2>
      <table className='status-table'>
        <tbody>
          <tr>
            <th>Initial</th>
            <th>Status Name</th>
            <th>Status Label(s)</th>
            <th>Delete Status</th>
          </tr>
          {statuses.map((status) => {
            return (
              <tr key={status.name}>
                <td>
                  <input
                    type='radio'
                    name='initial'
                    id={status.name}
                    checked={status.labels?.has('initial')}
                    onChange={changeInitial}
                  />
                </td>
                <td>{status.name}</td>
                <td>{status.labels ? new Array(...status.labels).join(', ') : null}</td>
                <td>
                  <button
                    className='button-delete'
                    onClick={() => {
                      deleteStatus(status);
                    }}
                  >
                    Delete status
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

export default StatusList;
