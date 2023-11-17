import { useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../context/DataContext";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
export default function NewCreate({ onCancel }) {
  const { server, setAuths, setHotps, cu } = useContext(DataContext);
  const [autoGen, setAutoGen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [type, setType] = useState(0);
  const types = ["totp", "hotp"];
  const navigate = useNavigate();
  return (
    <div className="new-create">
      <div className="my-bar">
        <FaArrowLeft className="icon" onClick={() => navigate("/")} />
        <p>Enter Account Details</p>
      </div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(
              autoGen
                ? `${server}/post-${types[type]}`
                : `${server}/create-${types[type]}`,
              {
                id: cu.uid,
                name: e.target.name.value,
                key: e.target?.token?.value?.trim()?.replace(/\s/g, ""),
              }
            )
            .then((res) => {
              console.log(res.data);
              if (res.data.totp)
                setAuths((prvAuths) => [...prvAuths, res.data.totp]);
              else if (res.data.hotp)
                setHotps((prv) => [...prv, res.data.hotp]);
            });
          navigate("/");
          //   onCancel();
        }}
      >
        <input type="text" name="name" placeholder="Account Name" />
        <input type="text" name="key" placeholder="Security Key" />
        <div className="field">
          <input
            type="checkbox"
            checked={autoGen}
            onChange={() => setAutoGen((prv) => !prv)}
          />
          <span>Auto Generate Key</span>
        </div>
        <div className="advanced"></div>
        <div className="flex">
          <div className="acc">
            <div className="type">Type of Key</div>
            <div className="head" onClick={() => setShowOptions(true)}>
              {["Time Based", "Counter Based"][type]}
            </div>
            {showOptions && (
              <div className="body">
                <div
                  className="item"
                  onClick={() => {
                    setType(0);
                    setShowOptions(false);
                  }}
                >
                  Time Based
                </div>
                <div
                  className="item"
                  onClick={() => {
                    setType(1);
                    setShowOptions(false);
                  }}
                >
                  Counter Based
                </div>
              </div>
            )}
          </div>
          <button>Add</button>
        </div>
      </form>
    </div>
  );
}
