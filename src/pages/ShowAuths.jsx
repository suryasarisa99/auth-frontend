import { useContext, useEffect, useRef, useState } from "react";
import { auth } from "../../firebase-config";
import axios from "axios";
import { MdContentCopy } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { CgNametag } from "../../node_modules/react-icons/cg/index.esm";
import CreateTotp from "./CreateTotp";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineRefresh } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { DataContext } from "../context/DataContext";
import { MdModeEdit, MdClose } from "react-icons/md";
import TopBar from "../components/TopBar";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
export default function ShowAuths() {
  const {
    cu,
    setCu,
    auths,
    server,
    setAuths,
    hotps,
    setHotps,
    openOverlay,
    closeOverlay,
    getInitialData,
    getUpdatedData,
    timer,
    setTimer,
    calcTime,
    longPress,
    setLongPress,
    selectedTotps,
    selectedHotps,
    setSelectedTotps,
    setSelectedHotps,
  } = useContext(DataContext);
  const [showDialog, setShowDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const copyTimerRef = useRef(null);
  const navigate = useNavigate();
  const longPressTimerRef = useRef(null);
  const longPressRef = useRef(null);

  useEffect(() => {
    if (cu) {
      getInitialData();
    }
  }, [cu]);

  useEffect(() => {
    function handlePopState() {
      if (longPress) {
        console.log("popstate longpress");
        setLongPress(false);
        setSelectedTotps([]);
        setSelectedHotps([]);
      }
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [longPress]);

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

  function onLongPress(e, ind, type) {
    if (!longPress) {
      longPressRef.current = e.currentTarget;
      longPressTimerRef.current = setTimeout(() => {
        setLongPress(true);
        history.pushState({}, "", "/select");
        if (type == "totp") setSelectedTotps([ind]);
        else if (type == "hotp") setSelectedHotps([ind]);
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
  function onTotpSelect(ind, e) {
    if (e) e.stopPropagation();

    setSelectedTotps((prv) => {
      if (prv.includes(ind))
        return prv.filter((selectedItem) => selectedItem != ind);
      else return [...prv, ind];
    });
  }
  function onHotpSelect(ind, e) {
    if (e) e.stopPropagation();

    setSelectedHotps((prv) => {
      if (prv.includes(ind))
        return prv.filter((selectedItem) => selectedItem != ind);
      else return [...prv, ind];
    });
  }

  function getValue(ind) {
    axios
      .post(`${server}/get-hotp`, {
        id: cu.uid,
        hotpIndex: ind,
      })
      .then((res) => {
        console.log(res.data.auth);
        // copy(res.data.auth.value);
        setHotps((prv) =>
          prv.map((_, i) => {
            if (ind == i) return res.data.auth;
            else return _;
          })
        );
      });
  }
  return (
    <div className="show-auths">
      <TopBar />
      <div
        className="auths totps"
        style={{ marginTop: longPress ? "26px" : "0" }}
      >
        {auths.map((auth, ind) => (
          <div className="auth-item" key={ind}>
            {longPress && (
              <input
                type="checkbox"
                name="mySelected"
                value={ind}
                checked={selectedTotps.includes(ind)}
                onChange={(e) => onTotpSelect(ind, e)}
              />
            )}
            <Box2
              ind={ind}
              auth={auth}
              copy={copy}
              onLongPress={(e, ind) => onLongPress(e, ind, "totp")}
              onSelect={onTotpSelect}
              onMove={onMove}
              onLeave={onLeave}
            />
          </div>
        ))}
      </div>
      <div className="auths hotps">
        {hotps.map((auth, ind) => (
          <div className="auth-item" key={ind}>
            {longPress && (
              <input
                type="checkbox"
                name="mySelected"
                value={ind}
                checked={selectedHotps.includes(ind)}
                onChange={(e) => onHotpSelect(ind, e)}
              />
            )}
            <Hotp
              ind={ind}
              auth={auth}
              getValue={() => getValue(ind)}
              copy={copy}
              // onLongPress={onLongPress}
              onLongPress={(e, ind) => onLongPress(e, ind, "hotp")}
              onMove={onMove}
              onSelect={onHotpSelect}
              onLeave={onLeave}
            />
          </div>
        ))}
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
        onClick={async () => {
          if (longPress) {
            navigate(-1);
            await new Promise((resolve) => setTimeout(resolve, 100));
          }
          navigate("/create");
          // openOverlay();
          // setShowDialog(true);
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
  onClick,
  onSelect = () => {},
  ind,
}) {
  return (
    <div
      className="auth-box-2"
      onTouchStart={(e) => onLongPress(e, ind)}
      onTouchMove={onMove}
      onTouchEnd={onLeave}
      // onMouseDown={(e) => onLongPress(e, ind)}
      // onMouseLeave={onLeave}
      onClick={() => onSelect(ind)}
    >
      <p className="name">
        <span className="text">{auth.name}</span>
      </p>
      <div className="value-box">
        <div className="values">
          <p className="value">{auth?.value?.substr(0, 3) || "___"}</p>
          <p className="value">{auth?.value?.substr(3) || "___"}</p>
        </div>
        <MdContentCopy className="icon" onClick={() => copy(auth.value)} />
      </div>
    </div>
  );
}

function Hotp({
  auth,
  copy,
  onLongPress,
  onMove = () => {},
  onLeave,
  getValue,
  onSelect = () => {},
  ind,
}) {
  return (
    <div
      className="auth-box-2"
      onTouchStart={(e) => onLongPress(e, ind)}
      onTouchEnd={onLeave}
      onTouchMove={onMove}
      // onMouseDown={(e) => onLongPress(e, ind)}
      // onMouseLeave={onLeave}
      onClick={() => onSelect(ind)}
    >
      <p className="name">
        <span className="text">{auth.name}</span>
      </p>
      <div className="value-box">
        <div className="values">
          <p className="value">{auth?.value?.substr(0, 3) || "___"}</p>
          <p className="value">{auth?.value?.substr(3) || "___"}</p>
        </div>
        <MdOutlineRefresh className="icon" onClick={getValue} />
      </div>
    </div>
  );
}
