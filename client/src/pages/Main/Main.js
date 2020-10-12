import React, { useState, useEffect, useContext } from "react";
import Bubble from "../../components/Toast/Toast";
import CalTab from "../../components/CalTab/CalTab";
import PostButton from "../../components/PostButton/PostButton";
import PostContext from "../../contexts/PostContext";
import SearchBar from "../../components/SearchBar/SearchBar";
import Navigation from "../../components/Navigation/Navigation";
import API from "../../lib/API";
import AuthContext from "../../contexts/AuthContext";
import { Button } from "react-bootstrap"
import Attendance from "../../components/Attendance/Attendance";

import "./Main.css"

const { promisify } = require('util')


function Main() {
  const auth = useContext(AuthContext);
  const [showAttendance, setShowAttendance] = useState(false);
  const [attendanceId, setAttendanceId] = useState();

  const postCon = useContext(PostContext);

  let showBtn;

  const [posts, setPosts] = useState([]);
  const [isScroll, setIsScroll] = useState(false);


  const handleScroll = () => {
    const timer = setTimeout(() => {
      setIsScroll(true);
    }, 10000);
    return () => clearTimeout(timer);
  };

  const handleRefresh = () => {
    setIsScroll(false);
  };

  const convertPostTime = (date, time) => {
    const postDateTime = [`date time`];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

    const dateArr = date.split(" ");

    const month = months.indexOf(dateArr[0]);
    const day = dateArr[1].replace("th", "");
    const dTime = dateArr[2];

    let d = new Date();

    d.setMonth(month);
    d.setDate(day);
    d.setHours(dTime, 0, 0);

    return d;
  };

  const userPostExists = () => {
    API.Posts.getAll(auth.authToken)
      .then(data => {
        const postCreatorIds = [];
        data.data.forEach(e => {
          postCreatorIds.push(e.UserId);
        })
        console.log(postCreatorIds);
        return postCreatorIds;
      });
  };

  const userPostExistsPromise = promisify(userPostExists)

  const userIsAttending = (postIds) => {
    postIds.forEach(postId => {
      API.Posts.getSignups(auth.authToken, postId)
        .then(data => {
          const attendance = [];
          data.data.forEach(e => {
            attendance.push(
              {
                id: e,
                attendance: data
              }
            )
          })
          console.log(attendance);
          return attendance;
        });
    });
  };

  const checkPostTime = (date) => {
    if (date.getTime() < Date.now() /*&& post has associated user*/) {
      //give the user a notification if they're the logged in user
    };
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    API.Posts.getAll(auth.authToken).then((response) => {
      console.log(response.data);
      setPosts(response.data);
      userIsAttending([1, 2, 3, 4]);
    });
  }, [postCon.submitted, isScroll]);

  if (isScroll) {
    showBtn = { position: "fixed", bottom: "5%", left: "25%", display: "block" }
  } else {
    showBtn = { position: "fixed", bottom: "5%", left: "25%", display: "none" }
  }

  const handleAttendanceClick = (id) => {
    setShowAttendance(val => !val);
    setAttendanceId(id);
  }

  return (
    <div>
      <Navigation />
      <div className="container-fluid">

        <div className="row">
          <div className="col-3">
            <div className="leftSide">
              {/* <SideNav /> */}
              <Attendance isShowing={showAttendance} id={attendanceId} />
            </div>
          </div>

          <div className="text-center col-6 middleRow">
            <h1 className="mt-4 mb-4 title">suggested for you <i className="fa fa-book" aria-hidden="true"></i></h1>
            <SearchBar />
            {posts.map(post => (
              <Bubble userType="student" key={post.id} id={post.id} subjectName={post.SubjectId} content={post.content} userName={post.UserId} time={post.time}
                title={post.title} date={post.date} isShowingAttendance={showAttendance} onAttendanceClick={handleAttendanceClick} />
            ))}
          </div>

          <div className="col-3 rightSide">
            <h1 className="text-center title">Calendar <i className="fa fa-calendar" aria-hidden="true"></i></h1>
            <CalTab />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div style={showBtn}>
              <Button variant="info" onClick={handleRefresh}>Refresh Posts ⟳</Button>
            </div>
            <PostButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
