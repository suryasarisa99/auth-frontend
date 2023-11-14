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
  function getAuths() {
    axios
      .post("https://2fa-b.vercel.app", {
        id: auth.currentUser.uid,
      })
      .then((res) => {
        setAuths(res.data.totps);
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

  const longPressRef = useRef(null);
  function onLongPress(ind) {
    if (!longPress)
      longPressRef.current = setTimeout(() => {
        setLongPress(true);
        setSelected([ind]);
      }, 400);
  }
  function onLeave() {
    if (longPressRef.current) clearTimeout(longPressRef.current);
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
      }, 1800);
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
      <div className="auths" style={{ marginTop: longPress ? "28px" : "0" }}>
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
                    onClick={(e) => onSelect(ind, e)}
                  />
                )}
                <Box2
                  key={ind}
                  auth={auth}
                  onLongPress={onLongPress}
                  onLeave={onLeave}
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
        <p className="text">{auth.name}</p>
        <MdContentCopy className="icon" />
      </p>
      <p className="value">{auth.value}</p>
    </div>
  );
}
function Box2({ auth, copy, onLongPress, onLeave, onSelect = () => {}, ind }) {
  return (
    <div
      className="auth-box-2"
      onTouchStart={() => onLongPress(ind)}
      onTouchEnd={onLeave}
      onClick={() => onSelect(ind)}
    >
      <p className="name">
        <p className="text">{auth.name}</p>
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
