import { useEffect, useRef, useState } from "react";
import { auth } from "../../firebase-config";
import axios from "axios";
import { MdContentCopy } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { CgNametag } from "../../node_modules/react-icons/cg/index.esm";
import CreateTotp from "./CreateTotp";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {} from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { MdModeEdit, MdClose } from "react-icons/md";
export default function ShowAuths({ cu, auths, setAuths }) {
  const [timer, setTimer] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const copyTimerRef = useRef(null);
  const [longPress, setLongPress] = useState(false);
  const [selected, setSelected] = useState([]);

  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);
  function getAuths() {
    axios
      .post("https://2fa-b.vercel.app", {
        id: auth.currentUser.uid,
      })
      .then((res) => {
        if (res.data.totps) setAuths(res.data.totps);
      });
  }
  function openOverlay() {
    document.getElementById("overlay").className = "";
  }
  function closeOverlay() {
    document.getElementById("overlay").className = "hidden";
  }
  function handleCancel() {
    closeOverlay();
    setShowDialog(false);
  }
  function copy(value) {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    setShowCopyDialog(true);
    navigator.clipboard.writeText(value);
    copyTimerRef.current = setTimeout(() => {
      setShowCopyDialog(false);
    }, 1200);
  }

  // const itemHeightRef = useRef(77.108);
  // const topBarHeightRef = useRef(9.708);
  const itemHeightRef = useRef(78.092);
  const topBarHeightRef = useRef(57);

  // useRef(() => {
  //   // itemHeightRef.current = longPress ? 78.092 + 0.1 : 77.108 + 1.5;
  //   itemHeightRef.current = longPress ? 78.092 + 0.1 : 77.108;
  //   topBarHeightRef.current = longPress ? 57 : 9.708;
  //   topBarHeightRef.current = longPress ? 57 : 9.708;
  // }, [longPress]);

  function calculateItem(y) {
    const topHeight = topBarHeightRef.current + 32 - 9;
    // console.log(Math.ceil((y - topHeight) / itemHeightRef.current));
    const result = (y - topHeight) / itemHeightRef.current;
    console.log(Math.floor(result));
    return Math.floor(result);
    // let dot = document.createElement("div");
    // dot.className = "dot";
    // dot.style.top = topHeight + "px";
    // document.documentElement.appendChild(dot);
  }
  // 77.108
  // 78.092
  // 0.984

  // topbar: 18.708 - 9 = 9.708
  // topbar: 66 -9 = 57
  // auths: paddingTop: 32

  // console.log(e.touches);
  // if (e.touches.length >= 2) {
  //   let y1 = calculateItem(e.touches[0].clientY);
  //   let y2 = calculateItem(e.touches[1].clientY);
  //   let s = y1 < y2 ? y1 : y2;
  //   let b = y1 > y2 ? y1 : y2;
  //   let temp = [];
  //   for (let i = s; i <= b; i++) {
  //     temp.push(i);
  //   }
  //   setSelected(temp);
  //   setTimeout(() => setLongPress(true), 400);
  // }

  const longPressTimerRef = useRef(null);
  const longPressRef = useRef(null);
  function onLongPress(e, ind) {
    if (!longPress) {
      longPressRef.current = e.currentTarget;
      longPressTimerRef.current = setTimeout(() => {
        setLongPress(true);
        setSelected([ind]);
      }, 550);
    }
  }
  function onLeave() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
      longPressRef.current = null;
    }
  }
  function onMove(e) {
    const targetElement = document.elementFromPoint(
      e.touches[0].clientX,
      e.touches[0].clientY
    );
    if (
      longPressRef.current &&
      longPressTimerRef.current &&
      !(
        longPressRef.current == targetElement ||
        !longPressRef.current.contains(targetElement)
      )
    ) {
      clearTimeout(longPressTimerRef.current);
    }
  }
  function onSelect(ind, e) {
    if (e) e.stopPropagation();

    setSelected((prv) => {
      if (prv.includes(ind))
        return prv.filter((selectedItem) => selectedItem != ind);
      else return [...prv, ind];
    });
  }
  useEffect(() => {
    if (cu) {
      getAuths();
    }
  }, [cu]);

  function calc() {
    // Assuming every TOTP has a fixed duration of 30 seconds
    const currentTime = Math.floor(Date.now() / 1000);
    const currentStep = Math.floor(currentTime / 30);
    const timeRemaining = (currentStep + 1) * 30 - currentTime;
    const progress = (30 - timeRemaining) / 30;
    return parseInt(progress * 100);
  }

  useEffect(() => {
    setInterval(() => {
      setTimer(calc());
    }, 100);
  }, []);

  useEffect(() => {
    if (timer > 95) {
      setTimeout(() => {
        getAuths();
      }, 1200);
    }
  }, [timer]);

  return (
    <div className="show-auths">
      <div className="top-bar">
        <progress value={timer} min={0} max={100} />

        {longPress && (
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className="items"
          >
            <div></div>
            <div className="icons">
              <MdClose
                className="cross-icon"
                onClick={() => {
                  setLongPress(false);
                  setSelected([]);
                }}
              />
              <FaTrash
                onClick={() => {
                  setAuths((auth) =>
                    auths.filter((auth, index) => !selected.includes(index))
                  );
                  axios.post("https://2fa-b.vercel.app/delete", {
                    id: cu.uid,
                    selected,
                  });
                  setSelected([]);
                  setLongPress(false);
                }}
              />
              <AnimatePresence>
                {selected.length == 1 && (
                  <motion.div
                    initial={{ x: 20 }}
                    exit={{ x: 50 }}
                    animate={{ x: 0 }}
                  >
                    <MdModeEdit />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
      <div className="auths" style={{ marginTop: longPress ? "26px" : "0" }}>
        {longPress ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {auths.map((auth, ind) => (
              <div className="while-long-press" key={ind}>
                {longPress && (
                  <input
                    type="checkbox"
                    name="mySelected"
                    value={ind}
                    checked={selected.includes(ind)}
                    onChange={(e) => onSelect(ind, e)}
                  />
                )}
                <Box2
                  key={ind}
                  auth={auth}
                  onLeave={onLeave}
                  onLongPress={onLongPress}
                  onSelect={onSelect}
                  ind={ind}
                />
              </div>
            ))}
          </form>
        ) : (
          <>
            {auths.map((auth, ind) => (
              <Box2
                key={ind}
                auth={auth}
                copy={copy}
                onLongPress={onLongPress}
                onLeave={onLeave}
                onMove={onMove}
                ind={ind}
              />
            ))}
          </>
        )}
      </div>
      {showDialog &&
        createPortal(
          <CreateTotp cu={cu} setAuths={setAuths} onCancel={handleCancel} />,
          document.getElementById("overlay")
        )}
      {showCopyDialog && (
        <motion.p initial={{ y: 0 }} animate={{ y: 20 }} className="copied">
          Copied
        </motion.p>
      )}

      <button
        className="float-btn"
        onClick={() => {
          openOverlay();
          setShowDialog(true);
        }}
      >
        <AiOutlinePlus className="icon" />
      </button>
    </div>
  );
}

function Box({ auth, copy }) {
  return (
    <div className="auth-box-1">
      <p className="name" onClick={() => copy(auth.value)}>
        <span className="text">{auth.name}</span>
        <MdContentCopy className="icon" />
      </p>
      <p className="value">{auth.value}</p>
    </div>
  );
}
function Box2({
  auth,
  copy,
  onLongPress,
  onMove = () => {},
  onLeave,
  onSelect = () => {},
  ind,
}) {
  return (
    <div
      className="auth-box-2"
      onTouchStart={(e) => onLongPress(e, ind)}
      onTouchEnd={onLeave}
      onTouchMove={onMove}
      onClick={() => onSelect(ind)}
    >
      <p className="name">
        <span className="text">{auth.name}</span>
      </p>
      <div className="value-box">
        <div className="values">
          <p className="value">{auth.value.substr(0, 3)}</p>
          <p className="value">{auth.value.substr(3)}</p>
        </div>
        <MdContentCopy className="icon" onClick={() => copy(auth.value)} />
      </div>
    </div>
  );
}
