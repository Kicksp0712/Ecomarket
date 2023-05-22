import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase";
import { ContainerComments } from "../../components/Comments/ContainerComments";
import { UserData } from "../../Context/UserContext";
import { ContainerPosts } from "../../components/Posts/ListPost";
const Home = () => {
  const { user } = UserData();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  React.useEffect(() => {
    let LogsRef = collection(db, "posts");
    const q = query(LogsRef, orderBy("time", "desc"));
    onSnapshot(q, (querySnapshot) => {
      let logs = [];
      querySnapshot.forEach((document) => {
        let data = document.data();
        data.id = document.id;
        logs.push(data);
      });
      setPosts(logs);
    });
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage("");
  };

  return (
    <>
      <ContainerPosts />
      {/* <ContainerComments key={post?.id} user={user} postId={post?.id} /> */}
    </>
  );
};

export default Home;
