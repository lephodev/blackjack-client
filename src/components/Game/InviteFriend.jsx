import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";

const InviteLink = () => {
  const [copy, setcopy] = useState(false);
  const [copytext, setcopytext] = useState(null);

  useEffect(() => {
    setcopytext(window.location.href);
    setcopy(false);
  }, [copy]);
  return (
    <div id="invite-link-box">
      <input
        id="invite-link"
        type="text"
        placeholder="Share game link"
        disabled
      />
      <CopyToClipboard text={copytext} onCopy={() => setcopy({ copy: true })}>
        <button
          type="button"
          onClick={() => {
            toast.success("Url copied", { id: "A" });
          }}
        >
          <i className="fa fa-copy"></i>
        </button>
      </CopyToClipboard>
    </div>
  );
};

export default InviteLink;
