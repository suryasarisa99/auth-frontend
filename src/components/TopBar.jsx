import { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { MdClose, MdModeEdit } from "react-icons/md";
import axios from "axios";
export default function TopBar() {
  const {
    timer,
    longPress,
    setLongPress,
    selectedTotps,
    selectedHotps,
    setSelectedTotps,
    setSelectedHotps,
    setAuths,
    setHotps,
    auths,
    server,
    cu,
  } = useContext(DataContext);
  return (
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
                history.back();
                setSelectedTotps([]);
                setSelectedHotps([]);
              }}
            />
            <FaTrash
              onClick={() => {
                setAuths((auth) =>
                  auths.filter((_, index) => !selectedTotps.includes(index))
                );
                setHotps((hotps) =>
                  hotps.filter((_, index) => !selectedHotps.includes(index))
                );
                axios.post(`${server}/delete`, {
                  id: cu.uid,
                  selectedTotps: selectedTotps,
                  selectedHotps: selectedHotps,
                });
                setLongPress(false);
                setSelectedTotps([]);
                setSelectedHotps([]);
              }}
            />
            {((selectedTotps.length == 1 && selectedHotps.length == 0) ||
              (selectedTotps.length == 0 && selectedHotps.length == 1)) && (
              <motion.div>
                <MdModeEdit />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
