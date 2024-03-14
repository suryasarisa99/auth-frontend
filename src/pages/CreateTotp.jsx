import { useState, useContext } from "react";
import axios from "axios";
import { auth } from "../../firebase-config";
import { DataContext } from "../context/DataContext";
export default function CreateTotp({ onCancel }) {
  const { cu, setAuths, server, setHotps } = useContext(DataContext);
  let [autoGen, setAutoGen] = useState(false);
  return (
    <div className="create-totp">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(autoGen ? `${server}/post-hotp` : `${server}/post-auth`, {
              id: auth.currentUser.uid,
              name: e.target.name.value,
              key: e.target?.token?.value?.trim()?.replace(/\s/g, ""),
            })
            .then((res) => {
              if (res.data.totp)
                setAuths((prvAuths) => [...prvAuths, res.data.totp]);
              else if (res.data.hotp)
                setHotps((prv) => [...prv, res.data.hotp]);
            });
          onCancel();
        }}
      >
        <input type="text" placeholder="Account Name" name="name" />
        {!autoGen && <input type="text" placeholder="Key" name="token" />}
        <div className="field">
          <input
            type="checkbox"
            checked={autoGen}
            onChange={() => setAutoGen((prv) => !prv)}
          />
          <span>Auto Generate Key</span>
        </div>
        <div className="btns">
          <button type="button" className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
