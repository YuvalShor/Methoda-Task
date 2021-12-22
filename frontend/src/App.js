import { useState, useEffect } from 'react';
import axios from 'axios';
import AddStatus from './components/AddStatus';
import AddTransition from './components/AddTransition';
import StatusList from './components/StatusList';
import TransitionList from './components/TransitionList';
import './App.css';

const APIPath = 'http://localhost:8000/api';

/* Fetch all statuses from the API */
const fetchStatuses = async () => {
  const { data } = await axios.get(`${APIPath}/statuses`);

  return data;
};

/* Fetch all transitions from the API */
const fetchTransitions = async () => {
  const { data } = await axios.get(`${APIPath}/transitions`);

  return data;
};

const App = () => {
  const [statuses, setStatuses] = useState([]);
  const [transitions, setTransitions] = useState([]);

  /* When app starts, fetch all data from DB (using the API) and set to state */
  useEffect(() => {
    fetchStatuses()
      .then(({ statuses: fetchedStatuses }) => {
        fetchedStatuses.forEach((status) => {
          status.labels = new Set(status.labels);
        });

        setStatuses(fetchedStatuses);
      })
      .catch((error) => {
        console.log(error);
      });

    fetchTransitions()
      .then(({ transitions: fetchedTransitions }) => {
        setTransitions(fetchedTransitions);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const resetConfiguration = async () => {
    /* Send reset data to backend */

    try {
      await axios.delete(`${APIPath}/delete`);
      setStatuses([]);
      setTransitions([]);
    } catch (error) {
      console.log(error);
    }
  };

  const saveConfiguration = async () => {
    /* Send data to backend */

    statuses.forEach((status) => {
      status.labels = [...status.labels];
    });

    try {
      await axios({
        method: 'post',
        url: `${APIPath}/save`,
        data: { statuses, transitions },
      });
    } catch (error) {
      console.log(error);
    } finally {
      statuses.forEach((status) => {
        status.labels = new Set(status.labels);
      });
    }
  };

  const addNewStatus = (newStatus, setNewStatus) => {
    if (newStatus.name === '') {
      console.log('no status name provided');
      return;
    }

    const statusNameNotUnique = statuses.find((status) => {
      return status.name === newStatus.name;
    });

    if (!statusNameNotUnique) {
      setStatuses([...statuses, newStatus]);
    } else {
      console.log('status name is not unique');
      return;
    }

    if (statuses.length === 0) {
      newStatus.labels = new Set(['initial', 'final']);
    } else {
      newStatus.labels = new Set(['orphan', 'final']);
    }

    setNewStatus({
      name: '',
      labels: new Set(['final', 'orphan']),
    });
  };

  const deleteStatus = (statusToDelete) => {
    if (statusToDelete.labels.has('initial')) {
      console.log('cannot delete initial status');
      return;
    }

    const updatedStatuses = statuses.filter((status) => {
      return statusToDelete.name !== status.name;
    });
    const updatedTransitions = transitions.filter((transition) => {
      return (
        transition.from !== statusToDelete.name &&
        transition.to !== statusToDelete.name
      );
    });

    updateStatusLabels(updatedStatuses, updatedTransitions);

    setStatuses(updatedStatuses);
    setTransitions(updatedTransitions);
  };

  /* Using the DFS algorithm to find the statuses
     that can be reached from the initial status */
  const dfs = (status, statuses, transitions, visitedSet) => {
    status.labels = new Set(['final']);
    visitedSet.add(status.name);

    transitions
      .filter((transition) => {
        return transition.from === status.name;
      })
      .forEach((transition) => {
        const foundStatus = statuses.find((status) => {
          return status.name === transition.to;
        });

        if (!visitedSet.has(foundStatus.name)) {
          dfs(foundStatus, statuses, transitions, visitedSet);
        }
      });
  };

  const updateStatusLabels = (statuses, transitions) => {
    const initial = statuses.find((status) => {
      return status.labels.has('initial');
    });

    let visitedSet = new Set();

    dfs(initial, statuses, transitions, visitedSet);

    /* Can't be reached from initial status, set to orphan */
    statuses.forEach((status) => {
      if (!visitedSet.has(status.name)) {
        status.labels = new Set(['orphan']);
      }
    });

    initial.labels = new Set(['initial']);

    const notFinals = transitions.map((transition) => {
      return transition.from;
    });

    statuses.forEach((status) => {
      if (notFinals.includes(status.name)) {
        status.labels.delete('final');
      } else {
        status.labels.add('final');
      }
    });
  };

  const addNewTransition = (newTransition, setNewTransition) => {
    if (!statuses || newTransition.name === '') {
      console.log('no statuses or the transition name is empty');
      return;
    }

    const transitionNameNotUnique = transitions.find((transition) => {
      return transition.name === newTransition.name;
    });

    if (transitionNameNotUnique) {
      console.log('transition name not unique');
      return;
    }

    const updatedTransitions = [...transitions, newTransition];
    const updatedStatuses = [...statuses];

    updateStatusLabels(updatedStatuses, updatedTransitions);

    setStatuses(updatedStatuses);
    setTransitions(updatedTransitions);
  };

  const deleteTransition = (transitionToDelete) => {
    const updatedTransitions = transitions.filter((transition) => {
      return transition.name !== transitionToDelete.name;
    });
    const updatedStatuses = [...statuses];

    updateStatusLabels(updatedStatuses, updatedTransitions);

    setStatuses(updatedStatuses);
    setTransitions(updatedTransitions);
  };

  const changeInitialStatus = (statusName) => {
    const updatedStatuses = [...statuses];

    updatedStatuses.find((status) => status.labels.has('initial')).labels =
      new Set(['orphan']);
    updatedStatuses.find((status) => status.name === statusName).labels =
      new Set(['initial']);

    updateStatusLabels(updatedStatuses, transitions);

    setStatuses(updatedStatuses);
  };

  return (
    <div className='App'>
      <h1 className='main-title'>Status App</h1>

      <div className='adders-container'>
        <AddStatus addNewStatus={addNewStatus} />
        <AddTransition
          statuses={statuses}
          transitions={transitions}
          addNewTransition={addNewTransition}
        />
      </div>
      <div className='lists-container'>
        <StatusList
          statuses={statuses}
          deleteStatus={deleteStatus}
          changeInitialStatus={changeInitialStatus}
        />
        <TransitionList
          transitions={transitions}
          deleteTransition={deleteTransition}
        />
      </div>

      <div className='buttons-container'>
        <button className='button-reset-config' onClick={resetConfiguration}>
          Reset configuration
        </button>
        <button className='button-save-config' onClick={saveConfiguration}>
          Save configuration to server
        </button>
      </div>
    </div>
  );
};

export default App;
