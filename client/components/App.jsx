import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DecisionMaker from './DecisionMaker.jsx';
import Home from './Home.jsx';
import UserProfile from './UserProfile.jsx';
import WallOfFame from './WallOfFame.jsx';
import RewardsStore from './RewardsStore.jsx';
import Navigation from './Navigation.jsx';
import axios from 'axios';
import Messages from './MessageComponents/Messages.jsx';
import SignUp from './SignUp.jsx';
import Overview from './Overview.jsx';
import Whack from './Whack.jsx';
import Controversy from './Controversy.jsx';
//import Notification from "./Notifications.jsx";
import { Flip, Bounce, Slice, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Hatemail from './HateMailComponents/HateMail.jsx';

import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '.././global.css';
import { useDispatch } from 'react-redux';
import { setAuthUser, setIsAuthenticated } from './store/appSlice.js';
import MoodNotes from './MoodNotes.jsx';
import MoodMemos from './MoodNotesComponents/MoodMemos.jsx';

import MoodGame from './MoodGame.jsx';
import SeeJudge from './SeeJudge.jsx';

const App = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState('');

  // create trophy variable on state for current user
  const [trophy, setTrophy] = useState('');
  // create placement variable in state for current user
  const [placement, setPlacement] = useState('');
  // create refresher for one more refresh when points are added
  const [refresher, setRefresher] = useState(0);
  // create points variable in state for current user
  const [points, setPoints] = useState('');
  // create balance variable in state from current user
  const [balance, setBalance] = useState('');
  // add top property to state, empty array initially
  const [top, setTop] = useState([]);
  // trophy state here to handle case where points are equal but trophies different
  const [matchTrophy, setMatchTrophy] = useState('');
  // user state here to hold users who have conflicting trophies but same points
  const [conflictedUser, setConflictedUser] = useState('');

  // useEffect hook to get top users and update state
  useEffect(() => {
    getList();
  }, [points]);

  // function to determine if two users have same points but different trophy
  const checkTrophy = () => {
    if (top) {
      // iterate through all users
      for (let i = 0; i < top.length; i++) {
        // determine if there is a NEXT user in array
        if (top[i + 1]) {
          // declare variables to grab current and next and previous
          const curr = top[i];
          const next = top[i + 1];
          // if theres a set with same points
          if (curr.points === next.points) {
            // and one is the current user
            if (next.id === user.id) {
              // set the trophy on state to the higher ranking trophy
              setTrophy(curr.trophy);
            }
          }
          // check if points are same but trophies are different
          if (curr.points === next.points && curr.trophy !== next.trophy) {
            // set conflicted user
            setConflictedUser(next);
            // set match trophy to higher trophy
            setMatchTrophy(curr.trophy);
          } else {
            // else there is no conflicts, reset conflicted user to empty
            setConflictedUser('');
          }
        }
      }
    }
  };
  // call check trophy for conflicts once with useEffect
  useEffect(() => {
    checkTrophy();
  }, [top, trophy, points, refresher]);

  useEffect(() => {
    fetchAuthUser();
    axios
      .get('/rewards')
      .then(({ data }) => {
        if (data.length === 0) {
          return axios.get('/rewards/seed');
        }
      })
      .catch((err) => console.error('failed getting rewards', err));
  }, []);

  const fetchAuthUser = async () => {
    try {
      const response = await axios.get(`/users/user`);
      if (response && response.data) {
        dispatch(setIsAuthenticated(true));
        dispatch(setAuthUser(response.data));
        setUser(response.data);
      }
    } catch (error) {
      console.error('cant get user or set auth user: ', error);
    }
  };

  // get current points from user
  const getPoints = async () => {
    // axios get request
    await axios
      .get(`/wofRoutes/users/${user.id}`)
      // grab points and assign to state
      .then(({ data }) => {
        setBalance(data.balance);
        setPoints(data.points);
      })
      .catch((err) => {
        console.error('Failed axios GET user points: ', err);
      });
  };

  useEffect(() => {
    if (user) {
      getPoints();
    }
  }, [user, refresher]);

  // get placement of current user
  // useEffect to get user placement
  const getPlacement = async () => {
    // axios get request
    const request = await axios.get('/wofRoutes/users');
    setPlacement(
      request.data.map((user) => user.id).indexOf(user.id) /
        request.data.length,
    );
  };

  useEffect(() => {
    if (user) {
      getPlacement();
    }
  }, [points]);

  // assign trophy according to placement
  const chooseAward = (user) => {
    // see if user has conflict
    if (
      user.id === conflictedUser.id &&
      user.trophy !== conflictedUser.trophy
    ) {
      // if so, both get higher trophy
      setTrophy(matchTrophy);
      // then determine is user has no points
    } else if (points === 0) {
      setTrophy('Earn points to win an award!');
    } else if (placement <= 0.1) {
      // determine user placement
      // top 10 percent get gold
      setTrophy('🏆');
    } else if (placement <= 0.2) {
      // top 20 get Silver
      setTrophy('🥈');
    } else if (placement <= 0.35) {
      // top 30 get Bronze
      setTrophy('🥉');
    } else {
      // else if placement is over top 30 percent, ribbon
      setTrophy('🎗️');
    }
  };
  useEffect(() => {
    chooseAward(user);
    // should update every time placement updates
  }, [user, placement, points, conflictedUser, matchTrophy]);

  // send trophy back to database
  useEffect(() => {
    if (user) {
      const sendTrophy = async () => {
        await axios
          .patch(`wofRoutes/users/${user.id}`, {
            trophy: trophy,
          })
          .catch((err) => {
            console.error('Failed to axios patch trophy: ', err);
          });
      };
      sendTrophy();
    }
  }, [trophy]);

  // function to get user list
  const getList = () => {
    //axios get request
    axios
      .get('/wofRoutes/users')
      // destructure to get data (array of top) from response
      .then(({ data }) => {
        // set top in state to filtered top given from axios
        setTop(data.slice(0, 15));
      })
      .catch((err) => {
        console.error('Failed axios GET top: ', err);
      });
  };

  // function to add necessary points to current user
  // also must update trophy - and balance
  const changePoints = (user, num) => {
    setRefresher(1);
    getPlacement();
    // points on user in state is 'read only' and cannot be directly updated
    // create variable to grab old points number from user
    const oldPoints = points;
    const newPoints = oldPoints + num;
    // determine if new value would be negative
    if (newPoints < 0) {
      // cap at zero
      newPoints = 0;
    }
    const oldBalance = balance;
    const newBalance = oldBalance + num;
    setBalance(oldBalance + num);
    // reset points on state
    setPoints(oldPoints + num);
    // axios patch request
    axios
      .patch(`wofRoutes/users/${user.id}`, {
        // increment old points variable INSTEAD of incrementing points property directly
        // and set that to points
        points: newPoints,
        balance: newBalance,
      })
      .catch((err) => {
        console.error('Failed axios PATCH: ', err);
      });
    // window.location.reload(false);
  };

  // user passed in is after balance has been updated
  const changeBalance = (user, num) => {
    const oldBalance = balance;
    setUser(user);
    setBalance(oldBalance - num);
  };

  //ToastContainer used to alert users throughout application (see toast types in components for specific notifications)
  return (
    <BrowserRouter>
      <ToastContainer transition={Flip} />
      <Routes>
        <Route index element={<SignUp />}></Route>
        <Route exact path="/" element={<Navigation />}>
          <Route
            exact
            path="/Home"
            element={<Home user={user} changePoints={changePoints} />}
          />
          <Route
            path="/UserProfile"
            element={
              <UserProfile user={user} trophy={trophy} points={points} />
            }
          />
          <Route
            path="/Messages"
            element={<Messages changePoints={changePoints} loggedIn={user} />}
          />
          <Route
            path="/WallOfFame"
            element={<WallOfFame changePoints={changePoints} />}
          />
          <Route
            path="/RewardsStore"
            element={
              <RewardsStore
                user={user}
                changeBalance={changeBalance}
                balance={balance}
              />
            }
          />
          <Route
            path="/DecisionMaker"
            element={<DecisionMaker changePoints={changePoints} user={user} />}
          />
          <Route
            path="/Whack"
            element={<Whack loggedIn={user} changePoints={changePoints} />}
          />
          <Route path="/Overview" element={<Overview />} />
          <Route path="/Controversy" element={<Controversy user={user} />} />
          <Route path="/hatemail" element={<Hatemail user={user} />} />

          <Route path="/MoodNotes" element={<MoodNotes />} />
          <Route path="/MoodMemos" element={<MoodMemos />} />         
          <Route path="/MoodGame" element={<MoodGame />} />
          <Route path="/SeeJudge" element={<SeeJudge />} />    
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
