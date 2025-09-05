import { useState } from "react";
import "../styles/ChangePassword.css";

export default function ChangePassword() {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [msg, setMsg] = useState("");

  function submit(e) {
    e.preventDefault();

    if (newPwd !== confirmPwd) {
      setMsg("❌ New passwords do not match!");
      return;
    }

    // TODO: API call to change password
    setMsg("✅ Password change not implemented yet.");
  }

  return (
    <div className="change-password-box">
      <h2>Change Password</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <label>Old Password</label>
          <input
            type="password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPwd}
            onChange={(e) => setConfirmPwd(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-submit">
          Update Password
        </button>
      </form>

      {msg && <div className="message">{msg}</div>}
    </div>
  );
}
