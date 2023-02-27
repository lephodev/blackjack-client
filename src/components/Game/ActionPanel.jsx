import { socket } from "../../config/socket";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import Button from "react-bootstrap/Button";

const ActionPanel = ({
  wallet,
  actionopen,
  handleActionOpen,
  tableId,
  player,
  handleBetIntervel,
  setActionCompleted,
  actionCompleted,
}) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleAction = useCallback(
    (val) => {
      // console.log("val", val);
      setActionCompleted(false);
      debounce((value) => {
        // if previous action is not completed then pause the button till then
        if (!actionCompleted) {
          return;
        }
        // console.log({ tableId });
        socket.emit(value, {
          tableId,
          userId: player.id,
          wallet
        });
      }, 300)(val);
    },
    [actionCompleted, tableId, player.id, setActionCompleted, wallet]
  );

  // console.log('ACS', { actionCompleted });

  return (
    <div className={`user-action-container ${ actionopen ? `` : `hide-panel` }`}>
      <div className="user-action-box">
        <button
          className="user-action"
          id="surrender"
          disabled={!actionCompleted}
          onClick={() => handleAction("surrender")}
        >
          <SurrenderIcon />
        </button>
        <div className="user-action-text">Surrender</div>
      </div>
      <div className="user-action-box">
        <button
          className="user-action"
          id="stand"
          disabled={!actionCompleted}
          onClick={() => handleAction("stand")}
        >
          <StandIcon />
        </button>
        <div className="user-action-text">Stand</div>
      </div>
      <div className="user-action-box">
        <button
          className="user-action"
          id="hit"
          disabled={!actionCompleted}
          onClick={() => handleAction("hit")}
        >
          <HitIcon />
        </button>
        <div className="user-action-text">Hit</div>
      </div>

      {player?.isActed || player?.splitSum?.length !== 0 ? 
      // (
      //   <div className="user-action-box">
      //     <Button
      //       className="user-action"
      //       id="doubleDown"
      //       onClick={() => handleAction("double")}
      //       disabled
      //     >
      //       <DoubleIcon />
      //     </Button>
      //     <div className="user-action-text">2X Down</div>
      //   </div>
      // ) : 
      (
        <div className="user-action-box">
          <button
            className="user-action"
            id="doubleDown"
            disabled={!actionCompleted}
            onClick={() => handleAction("double")}
          >
            <DoubleIcon />
          </button>
          <div className="user-action-text">2X Down</div>
        </div>
      ) : ''
      }

      {player?.splitSum?.length === 0 && player?.isSameCard ? (
        <div className="user-action-box">
          <button
            className="user-action"
            id="doubleDown"
            disabled={!actionCompleted}
            onClick={() => handleAction("split")}
          >
            <SplitIcon />
          </button>
          <div className="user-action-text">Split</div>
        </div>
      ) : (
        <div className="user-action-box">
          <Button
            className="user-action"
            id="doubleDown"
            onClick={() => handleAction("split")}
            disabled
          >
            <SplitIcon />
          </Button>
          <div className="user-action-text">Split</div>
        </div>
      )}
    </div>
  );
};

export default ActionPanel;

const SplitIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.6501 3.59998C6.57597 3.59998 5.54584 4.02667 4.78632 4.78619C4.02679 5.54572 3.6001 6.57585 3.6001 7.64998V12.15C3.6001 13.2241 4.02679 14.2542 4.78632 15.0138C5.54584 15.7733 6.57597 16.2 7.6501 16.2H12.1501C13.2242 16.2 14.2544 15.7733 15.0139 15.0138C15.7734 14.2542 16.2001 13.2241 16.2001 12.15V7.64998C16.2001 6.57585 15.7734 5.54572 15.0139 4.78619C14.2544 4.02667 13.2242 3.59998 12.1501 3.59998H7.6501ZM7.6501 19.8C6.57597 19.8 5.54584 20.2267 4.78632 20.9862C4.02679 21.7457 3.6001 22.7758 3.6001 23.85V28.35C3.6001 29.4241 4.02679 30.4542 4.78632 31.2138C5.54584 31.9733 6.57597 32.4 7.6501 32.4H12.1501C13.2242 32.4 14.2544 31.9733 15.0139 31.2138C15.7734 30.4542 16.2001 29.4241 16.2001 28.35V23.85C16.2001 22.7758 15.7734 21.7457 15.0139 20.9862C14.2544 20.2267 13.2242 19.8 12.1501 19.8H7.6501ZM23.8501 3.59998C22.776 3.59998 21.7458 4.02667 20.9863 4.78619C20.2268 5.54572 19.8001 6.57585 19.8001 7.64998V12.15C19.8001 13.2241 20.2268 14.2542 20.9863 15.0138C21.7458 15.7733 22.776 16.2 23.8501 16.2H28.3501C29.4242 16.2 30.4544 15.7733 31.2139 15.0138C31.9734 14.2542 32.4001 13.2241 32.4001 12.15V7.64998C32.4001 6.57585 31.9734 5.54572 31.2139 4.78619C30.4544 4.02667 29.4242 3.59998 28.3501 3.59998H23.8501ZM23.8501 19.8C22.776 19.8 21.7458 20.2267 20.9863 20.9862C20.2268 21.7457 19.8001 22.7758 19.8001 23.85V28.35C19.8001 29.4241 20.2268 30.4542 20.9863 31.2138C21.7458 31.9733 22.776 32.4 23.8501 32.4H28.3501C29.4242 32.4 30.4544 31.9733 31.2139 31.2138C31.9734 30.4542 32.4001 29.4241 32.4001 28.35V23.85C32.4001 22.7758 31.9734 21.7457 31.2139 20.9862C30.4544 20.2267 29.4242 19.8 28.3501 19.8H23.8501Z"
        fill="white"
      />
    </svg>
  );
};

const SurrenderIcon = () => {
  return (
    <svg
      width="37"
      height="37"
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.62158 5C10.0194 5 10.4009 5.15804 10.6822 5.43934C10.9635 5.72064 11.1216 6.10218 11.1216 6.5V7.82C12.7116 7.16 14.8716 6.5 17.1216 6.5C21.6216 6.5 21.6216 9.5 24.6216 9.5C29.1216 9.5 30.6216 6.5 30.6216 6.5V18.5C30.6216 18.5 29.1216 21.5 24.6216 21.5C20.1216 21.5 20.1216 18.5 17.1216 18.5C12.6216 18.5 11.1216 21.5 11.1216 21.5V32H8.12158V6.5C8.12158 6.10218 8.27962 5.72064 8.56092 5.43934C8.84223 5.15804 9.22376 5 9.62158 5Z"
        fill="white"
      />
    </svg>
  );
};

const StandIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.6026 33.7357L4.60703 20.7223C4.38695 20.2448 4.59648 19.6773 5.07348 19.4571L14.1553 15.2728C14.6322 15.0535 15.2002 15.2623 15.42 15.7401L21.4164 28.7527C21.6365 29.2309 21.427 29.7977 20.9491 30.0183L11.8682 34.2021C11.3904 34.4232 10.8228 34.2126 10.6026 33.7357ZM12.4427 28.8623L13.5197 25.7319L16.6502 26.8091L17.1888 25.2444L14.0582 24.1674L15.1358 21.0369L13.5712 20.4983L12.4936 23.6284L9.36367 22.5509L8.82508 24.1159L11.9551 25.1934L10.8776 28.3238L12.4427 28.8623ZM19.9007 14.0229C23.2687 8.00238 16.1664 6.61871 12.6876 9.62182L9.95247 13.2326C7.44977 14.7656 6.88044 12.3736 7.68011 11.1392L11.4844 5.97014L18.3159 2.30363C18.8156 1.938 19.5701 1.73178 20.6198 1.70984L34.2932 1.81271L34.3541 9.6908L26.8093 9.14764C26.9372 12.1988 23.8046 12.8798 22.1207 16.6644L21.1495 19.9255C19.0248 19.2111 18.2462 17.5091 19.9007 14.0228V14.0229ZM10.7722 13.8065L13.5176 10.1974C14.3919 9.46074 15.5925 8.95463 16.8167 8.97572C15.7434 10.1013 15.3993 10.7727 15.1661 11.7211C14.6036 13.1116 13.9187 13.8087 13.031 13.3591C12.2778 14.0849 11.5254 14.4047 10.7722 13.8066V13.8065Z"
        fill="white"
      />
    </svg>
  );
};

const DoubleIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32.2049 6.525L30.1949 5.685V19.23L33.8399 10.44C34.4549 8.91 33.7499 7.155 32.2049 6.525M2.95495 12.075L10.3949 30C10.614 30.5454 10.9877 31.0148 11.4701 31.3506C11.9525 31.6864 12.5224 31.8739 13.1099 31.89C13.4999 31.89 13.9049 31.815 14.2949 31.65L25.3499 27.075C26.4749 26.61 27.1649 25.5 27.1949 24.39C27.2099 24 27.1349 23.565 26.9999 23.175L19.4999 5.25C19.2879 4.70103 18.9156 4.22859 18.4313 3.89417C17.9471 3.55976 17.3734 3.37885 16.7849 3.375C16.3949 3.375 16.0049 3.465 15.6299 3.6L4.58995 8.175C3.85609 8.47552 3.27161 9.05516 2.96502 9.7865C2.65842 10.5178 2.6548 11.341 2.95495 12.075M27.1799 6.375C27.1799 5.57935 26.8639 4.81629 26.3013 4.25368C25.7387 3.69107 24.9756 3.375 24.1799 3.375H22.0049L27.1799 15.885"
        fill="white"
      />
      <path
        d="M11.2291 14.5095C11.1634 14.902 10.9446 15.2523 10.6207 15.4833C10.2967 15.7144 9.89429 15.8074 9.50183 15.7418C9.10938 15.6761 8.75908 15.4573 8.52798 15.1333C8.29689 14.8094 8.20394 14.407 8.26959 14.0145C8.22459 14.2995 8.26959 14.013 8.26959 14.013V14.01L8.27109 14.0055L8.27259 13.998L8.27559 13.9785C8.28714 13.912 8.30115 13.846 8.31759 13.7805C8.4773 13.1498 8.76023 12.5569 9.15009 12.036C9.90609 11.0295 11.2201 10.125 13.2766 10.125C14.9671 10.125 16.4926 10.659 17.4736 11.907C18.4396 13.1325 18.6361 14.742 18.3541 16.3785C18.0916 17.9055 17.2471 18.849 16.2421 19.458C15.5776 19.8615 14.7451 20.157 14.0926 20.388C13.9066 20.4555 13.7326 20.517 13.5841 20.574C12.7921 20.877 12.2671 21.165 11.9086 21.5865C11.6873 21.8538 11.5257 22.1652 11.4346 22.5H16.8766C17.2744 22.5 17.6559 22.658 17.9372 22.9393C18.2185 23.2206 18.3766 23.6022 18.3766 24C18.3766 24.3978 18.2185 24.7794 17.9372 25.0607C17.6559 25.342 17.2744 25.5 16.8766 25.5H9.75009C9.35226 25.5 8.97073 25.342 8.68943 25.0607C8.40812 24.7794 8.25009 24.3978 8.25009 24C8.25009 22.122 8.72259 20.7015 9.62109 19.644C10.4881 18.6225 11.6116 18.114 12.5131 17.772C12.8221 17.6535 13.0921 17.556 13.3351 17.4705C13.8961 17.2695 14.3056 17.124 14.6866 16.893C15.0841 16.653 15.3061 16.3965 15.3961 15.8715C15.5911 14.7345 15.3751 14.0925 15.1156 13.7625C14.8726 13.4535 14.3596 13.125 13.2751 13.125C12.2236 13.125 11.7751 13.5345 11.5471 13.8375C11.4012 14.0335 11.2938 14.2554 11.2306 14.4915L11.2276 14.5095H11.2291ZM11.2291 14.5035L11.2321 14.4885V14.4975L11.2291 14.5035ZM11.2291 14.5095V14.5035V14.5125V14.5095ZM22.0606 18.4395C21.9222 18.2962 21.7567 18.182 21.5737 18.1033C21.3907 18.0247 21.1939 17.9834 20.9947 17.9816C20.7955 17.9799 20.598 18.0178 20.4137 18.0933C20.2293 18.1687 20.0618 18.2801 19.921 18.4209C19.7802 18.5617 19.6688 18.7292 19.5934 18.9136C19.5179 19.0979 19.48 19.2954 19.4817 19.4946C19.4834 19.6938 19.5248 19.8906 19.6034 20.0736C19.682 20.2566 19.7963 20.4221 19.9396 20.5605L21.1291 21.75L19.9396 22.9395C19.6663 23.2224 19.5152 23.6013 19.5186 23.9946C19.522 24.3879 19.6797 24.7641 19.9579 25.0422C20.236 25.3203 20.6122 25.4781 21.0055 25.4815C21.3988 25.4849 21.7777 25.3337 22.0606 25.0605L23.2501 23.871L24.4396 25.0605C24.578 25.2038 24.7435 25.318 24.9265 25.3967C25.1095 25.4753 25.3063 25.5166 25.5055 25.5184C25.7047 25.5201 25.9022 25.4822 26.0865 25.4067C26.2709 25.3313 26.4383 25.2199 26.5792 25.0791C26.72 24.9383 26.8314 24.7708 26.9068 24.5864C26.9822 24.4021 27.0202 24.2046 27.0185 24.0054C27.0167 23.8062 26.9753 23.6094 26.8967 23.4264C26.8181 23.2434 26.7039 23.0779 26.5606 22.9395L25.3711 21.75L26.5606 20.5605C26.8338 20.2776 26.985 19.8987 26.9816 19.5054C26.9782 19.1121 26.8204 18.7359 26.5423 18.4578C26.2642 18.1797 25.888 18.0219 25.4947 18.0185C25.1014 18.0151 24.7225 18.1663 24.4396 18.4395L23.2501 19.629L22.0606 18.4395Z"
        fill="#010101"
      />
    </svg>
  );
};

const HitIcon = () => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.7625 34.3267L6.23767 31.0487C5.44258 30.7436 5.41902 30.1988 6.18212 29.8332L14.4 32.9931C15.4564 33.3993 17.0178 33.3391 18.0404 32.8553L29.3974 27.4694C30.1015 27.7813 30.091 28.3003 29.3503 28.6505L17.6084 34.2188C16.8362 34.5841 15.5603 34.6338 14.7624 34.3267H14.7625ZM14.7625 32.0507L6.23767 28.7726C5.56105 28.5131 5.44293 28.08 5.89293 27.7312L14.4 31.002C15.4564 31.4081 17.0178 31.3479 18.0404 30.8641L29.6696 25.3493C30.0813 25.6599 29.9776 26.0778 29.3502 26.3745L17.6085 31.9427C16.8363 32.3081 15.5605 32.3578 14.7625 32.0506V32.0507ZM14.7625 30.0598L6.23767 26.7814C5.56098 26.522 5.443 26.0889 5.893 25.7399L14.4001 29.0111C15.4565 29.4168 17.0178 29.3566 18.0405 28.8732L29.6697 23.3581C30.0813 23.6686 29.9776 24.0865 29.3503 24.3832L17.6086 29.952C16.8364 30.3172 15.5605 30.3665 14.7626 30.0598L14.7625 30.0598ZM14.7625 28.0686L6.23767 24.7902C5.56098 24.5307 5.443 24.0976 5.893 23.7487L14.4001 27.0199C15.4565 27.4261 17.0178 27.3659 18.0405 26.8821L29.6697 21.3668C30.0813 21.6779 29.9776 22.0958 29.3503 22.3924L17.6086 27.9607C16.8364 28.3261 15.5605 28.3754 14.7626 28.0686H14.7625ZM14.7625 26.0773L6.23767 22.7995C5.43962 22.4933 5.41902 21.9452 6.19126 21.5794L12.325 18.6701L14.7737 19.9585C15.8541 20.5273 17.4412 20.4549 18.4652 19.7904L23.0875 16.79L29.3034 19.1812C30.101 19.4875 30.1225 20.0362 29.3502 20.4014L17.6085 25.9698C16.8362 26.335 15.5604 26.3847 14.7624 26.0776L14.7625 26.0773ZM15.2441 19.0651L6.57004 14.4998C5.81298 14.1012 5.78134 13.3996 6.49846 12.9341L13.889 8.13682H15.7062L15.7073 12.7045H19.8321V8.13682H23.3579L21.4252 5.22659L29.786 9.62702C30.5428 10.0257 30.5744 10.7271 29.8573 11.1927L17.9159 18.9434C17.1987 19.4089 16.0013 19.4637 15.2442 19.0651H15.2441ZM16.7655 11.6455V7.07834H14.3155L17.7699 1.47162L21.2237 7.07834H18.7735V11.6455H16.7655V11.6455Z"
        fill="white"
      />
    </svg>
  );
};
