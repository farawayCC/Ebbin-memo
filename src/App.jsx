import React, { Component } from 'react';
import NewMemo from './components/NewMemo'
import MemoList from './components/MemoList'

class App extends Component {

  render() {
    return (
      <div className='App'>
        <NewMemo />
        <MemoList />
      </div>
    );
  }
}

export default App;
