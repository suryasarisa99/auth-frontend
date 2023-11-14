import { useState } from "react";
import axios from "axios";
import { auth } from "../../firebase-config";
export default function CreateTotp({ cu, setAuths, onCancel }) {
  let [autoGen, setAutoGen] = useState(false);
  return (
    <div className="create-totp">
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          axios
            .post(
              autoGen
                ? "https://2fa-b.vercel.app/create-auth"
                : "https://2fa-b.vercel.app/post-auth",
              {
                id: auth.currentUser.uid,
                name: e.target.name.value,
                key: e.target?.token?.value,
              }
            )
            .then((res) => {
              setAuths((prvAuths) => [...prvAuths, res.data.auth]);
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
            onClick={() => setAutoGen((prv) => !prv)}
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
