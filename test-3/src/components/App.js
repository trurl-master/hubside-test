import React, { Component } from 'react';
import { Provider, Subscribe } from 'unstated';

import style from './App.module.scss';

import ListContainer from '../containers/ListContainer';
import HList from './HList';

class App extends Component {
  render() {
    return (
      <Provider>
        <Subscribe to={[ListContainer]}>
          {listContainer => {
            const firstMasterList = listContainer.getMasterLists()[0];

            return (
              <div className={style.app}>
                <h1>{firstMasterList.content}</h1>
                <button onClick={() => { listContainer.clearList(firstMasterList.id) }}>Clear list</button>
                <HList
                  parentItem={firstMasterList}
                  listContainer={listContainer}
                  />
                <div className={style.note}>
                  Use Key Up and Key Down to navigate through the list.<br />
                  Tab to indent<br />
                  Shift-Tab to deindent<br />
                  Backspace on empty item to delete
                </div>
              </div>
            )
          }}
        </Subscribe>
      </Provider>
    );
  }
}

export default App;
