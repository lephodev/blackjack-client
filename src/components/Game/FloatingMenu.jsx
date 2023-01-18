import React, { useState } from 'react';

const FloatingMenu = ({
  setModalShow,
  handleClick,
  volume,
  setVolume,
  setConfirmExit,
  setShowInvite,
}) => {
  const [toggle, setToggle] = useState(false);

  return (
    <div className='floating-container'>
      <div className={`floating-menu ${toggle ? 'open' : ''}`}>
        <div onClick={() => setToggle(!toggle)} className='floating-menu-item'>
          <div className='floating-menu-icon'>
            {toggle ? <CrossIcon /> : <NavIcon />}
          </div>
        </div>
        {toggle ? (
          <>
            <div
              onClick={() => setConfirmExit(true)}
              className='floating-menu-item'>
              <div className='floating-menu-icon'>
                <LogoutIcon />
              </div>
              <span className='submenu-tooltip tooltip-logout'>Exit Table</span>
            </div>
            <div
              onClick={() => setModalShow(true)}
              className="floating-menu-item"
            >
              <div className="floating-menu-icon">
                <AddCoinIcon />
              </div>
              <span className="submenu-tooltip tooltip-coins">Fill Wallet</span>
            </div>
            <div onClick={() => handleClick()} className='floating-menu-item'>
              <div className='floating-menu-icon'>
                <ChatIcon />
              </div>
              <span className='submenu-tooltip tooltip-chat'>Chat</span>
            </div>
            <div
              onClick={() => setVolume(!volume)}
              className='floating-menu-item'>
              <div className='floating-menu-icon'>
                {volume ? <VolumeIcon /> : <MuteIcon />}
              </div>
              <span className='submenu-tooltip tooltip-volume'>Volume</span>
            </div>
            <div
              onClick={() => setShowInvite(true)}
              className='floating-menu-item'>
              <div className='floating-menu-icon'>
                <InviteIcon />
              </div>
              <span className='submenu-tooltip tooltip-invite'>Invitation</span>
            </div>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default FloatingMenu;

const InviteIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M15.8333 14.1667V15.8333H5.83333V14.1667C5.83333 14.1667 5.83333 10.8333 10.8333 10.8333C15.8333 10.8333 15.8333 14.1667 15.8333 14.1667ZM13.3333 6.66667C13.3333 6.17221 13.1867 5.68886 12.912 5.27774C12.6373 4.86662 12.2469 4.54619 11.79 4.35697C11.3332 4.16775 10.8306 4.11824 10.3456 4.2147C9.86065 4.31117 9.4152 4.54927 9.06557 4.8989C8.71593 5.24853 8.47783 5.69399 8.38137 6.17894C8.28491 6.66389 8.33441 7.16656 8.52363 7.62337C8.71285 8.08019 9.03328 8.47064 9.44441 8.74534C9.85553 9.02004 10.3389 9.16667 10.8333 9.16667C11.4964 9.16667 12.1323 8.90327 12.6011 8.43443C13.0699 7.96559 13.3333 7.32971 13.3333 6.66667ZM16 10.8833C16.4555 11.3036 16.8228 11.8104 17.0803 12.3741C17.3379 12.9378 17.4805 13.5472 17.5 14.1667V15.8333H20V14.1667C20 14.1667 20 11.2917 16 10.8833M15 4.16667C14.7482 4.16682 14.498 4.20618 14.2583 4.28333C14.7459 4.98247 15.0073 5.81432 15.0073 6.66667C15.0073 7.51901 14.7459 8.35086 14.2583 9.05C14.498 9.12715 14.7482 9.16651 15 9.16667C15.663 9.16667 16.2989 8.90327 16.7678 8.43443C17.2366 7.96559 17.5 7.32971 17.5 6.66667C17.5 6.00362 17.2366 5.36774 16.7678 4.8989C16.2989 4.43006 15.663 4.16667 15 4.16667ZM6.66667 8.33333H4.16667V5.83333H2.5V8.33333H0V10H2.5V12.5H4.16667V10H6.66667V8.33333Z'
        fill='white'
      />
    </svg>
  );
};

const MuteIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <g clip-path='url(#clip0_21_1179)'>
        <path
          d='M11.0501 2.75C11.1805 2.6567 11.3331 2.59925 11.4927 2.58338C11.6523 2.56751 11.8132 2.59378 11.9595 2.65957C12.1057 2.72535 12.2321 2.82835 12.3261 2.95828C12.4201 3.0882 12.4784 3.24051 12.4951 3.4L12.5001 3.495V16.505C12.5001 16.6654 12.4581 16.8229 12.3782 16.962C12.2983 17.101 12.1834 17.2167 12.0448 17.2974C11.9062 17.3781 11.7489 17.4211 11.5885 17.422C11.4282 17.4229 11.2704 17.3817 11.1309 17.3025L11.0509 17.2508L5.56675 13.3333H3.33341C2.91293 13.3335 2.50794 13.1747 2.19962 12.8888C1.89131 12.6028 1.70245 12.211 1.67091 11.7917L1.66675 11.6667V8.33333C1.66683 7.913 1.82572 7.50821 2.11161 7.20007C2.3975 6.89193 2.78926 6.70319 3.20841 6.67167L3.33341 6.66667H5.56675L11.0501 2.75ZM14.6551 7.64333L15.8334 8.82167L17.0117 7.64333C17.0886 7.56374 17.1806 7.50026 17.2822 7.45658C17.3839 7.41291 17.4933 7.38992 17.6039 7.38896C17.7146 7.388 17.8243 7.40908 17.9267 7.45098C18.0291 7.49288 18.1222 7.55476 18.2004 7.633C18.2787 7.71125 18.3405 7.80429 18.3824 7.9067C18.4243 8.00912 18.4454 8.11885 18.4445 8.2295C18.4435 8.34015 18.4205 8.4495 18.3768 8.55117C18.3332 8.65284 18.2697 8.74479 18.1901 8.82167L17.0117 10L18.1901 11.1783C18.3464 11.3346 18.4343 11.5466 18.4344 11.7676C18.4345 11.9887 18.3468 12.2007 18.1905 12.3571C18.0342 12.5135 17.8223 12.6013 17.6012 12.6014C17.3802 12.6015 17.1681 12.5138 17.0117 12.3575L15.8334 11.1775L14.6551 12.3567C14.4987 12.5129 14.2867 12.6007 14.0656 12.6006C13.8446 12.6005 13.6326 12.5126 13.4763 12.3563C13.3201 12.1999 13.2323 11.9878 13.2324 11.7668C13.2325 11.5457 13.3204 11.3338 13.4767 11.1775L14.6551 10L13.4767 8.82167C13.3972 8.74479 13.3337 8.65284 13.29 8.55117C13.2463 8.4495 13.2233 8.34015 13.2224 8.2295C13.2214 8.11885 13.2425 8.00912 13.2844 7.9067C13.3263 7.80429 13.3882 7.71125 13.4664 7.633C13.5447 7.55476 13.6377 7.49288 13.7401 7.45098C13.8425 7.40908 13.9523 7.388 14.0629 7.38896C14.1736 7.38992 14.2829 7.41291 14.3846 7.45658C14.4863 7.50026 14.5782 7.56374 14.6551 7.64333Z'
          fill='white'
        />
      </g>
      <defs>
        <clipPath id='clip0_21_1179'>
          <rect width='20' height='20' fill='red' />
        </clipPath>
      </defs>
    </svg>
  );
};

const VolumeIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <g clip-path='url(#clip0_21_1175)'>
        <path
          d='M11.0501 2.75C11.1805 2.6567 11.3331 2.59925 11.4927 2.58338C11.6523 2.56751 11.8132 2.59378 11.9595 2.65957C12.1057 2.72535 12.2321 2.82835 12.3261 2.95828C12.4201 3.0882 12.4784 3.24051 12.4951 3.4L12.5001 3.495V16.505C12.5001 16.6654 12.4581 16.8229 12.3782 16.962C12.2983 17.101 12.1834 17.2167 12.0448 17.2974C11.9062 17.3781 11.7489 17.4211 11.5885 17.422C11.4282 17.4229 11.2704 17.3817 11.1309 17.3025L11.0509 17.2508L5.56675 13.3333H3.33341C2.91293 13.3335 2.50794 13.1747 2.19962 12.8888C1.89131 12.6028 1.70245 12.211 1.67091 11.7917L1.66675 11.6667V8.33333C1.66662 7.91285 1.82542 7.50786 2.11133 7.19954C2.39724 6.89123 2.78912 6.70237 3.20841 6.67083L3.33341 6.66667H5.56675L11.0501 2.75ZM16.3892 5.6525C17.0015 6.19913 17.4912 6.86906 17.8263 7.61832C18.1614 8.36758 18.3342 9.17923 18.3334 10C18.3342 10.8208 18.1614 11.6324 17.8263 12.3817C17.4912 13.1309 17.0015 13.8009 16.3892 14.3475C16.3079 14.4217 16.2127 14.479 16.1091 14.5162C16.0055 14.5534 15.8955 14.5697 15.7856 14.5641C15.6756 14.5585 15.5679 14.5312 15.4685 14.4838C15.3692 14.4364 15.2802 14.3697 15.2068 14.2877C15.1334 14.2057 15.0769 14.1099 15.0407 14.006C15.0045 13.902 14.9892 13.7919 14.9958 13.682C15.0024 13.5721 15.0307 13.4646 15.079 13.3657C15.1274 13.2668 15.1949 13.1785 15.2776 13.1058C15.7152 12.7155 16.0653 12.237 16.3047 11.7017C16.5441 11.1664 16.6675 10.5864 16.6667 10C16.6667 8.76667 16.1317 7.65833 15.2776 6.89417C15.1949 6.8215 15.1274 6.73317 15.079 6.63428C15.0307 6.53538 15.0024 6.42789 14.9958 6.318C14.9892 6.20811 15.0045 6.09801 15.0407 5.99405C15.0769 5.89009 15.1334 5.79434 15.2068 5.71232C15.2802 5.6303 15.3692 5.56365 15.4685 5.51621C15.5679 5.46876 15.6756 5.44147 15.7856 5.43591C15.8955 5.43035 16.0055 5.44662 16.1091 5.4838C16.2127 5.52098 16.3079 5.57831 16.3892 5.6525V5.6525ZM14.7226 7.51583C15.0723 7.82812 15.352 8.21079 15.5434 8.63876C15.7349 9.06673 15.8337 9.53033 15.8334 9.99917C15.834 10.4683 15.7353 10.9322 15.5439 11.3605C15.3524 11.7888 15.0725 12.1717 14.7226 12.4842C14.5645 12.6245 14.3591 12.6996 14.1478 12.6941C13.9365 12.6887 13.7352 12.6032 13.5846 12.4549C13.434 12.3066 13.3453 12.1067 13.3366 11.8955C13.3279 11.6843 13.3997 11.4777 13.5376 11.3175L13.6109 11.2425C13.9526 10.9358 14.1667 10.4933 14.1667 10C14.1677 9.57326 14.0042 9.16256 13.7101 8.85333L13.6109 8.7575C13.5282 8.68483 13.4607 8.5965 13.4124 8.49761C13.364 8.39872 13.3357 8.29122 13.3291 8.18133C13.3226 8.07145 13.3378 7.96134 13.374 7.85738C13.4102 7.75342 13.4667 7.65767 13.5401 7.57566C13.6136 7.49364 13.7025 7.42698 13.8018 7.37954C13.9012 7.3321 14.0089 7.30481 14.1189 7.29924C14.2288 7.29368 14.3388 7.30996 14.4424 7.34713C14.546 7.38431 14.6412 7.44165 14.7226 7.51583V7.51583Z'
          fill='white'
        />
      </g>
      <defs>
        <clipPath id='clip0_21_1175'>
          <rect width='20' height='20' fill='white' />
        </clipPath>
      </defs>
    </svg>
  );
};

const ChatIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M2.49992 10C1.58325 10 0.833252 9.25 0.833252 8.33333V4.16667C0.833252 3.25 1.58325 2.5 2.49992 2.5H9.16659C10.0833 2.5 10.8333 3.25 10.8333 4.16667V8.33333C10.8333 9.25 10.0833 10 9.16659 10H7.49992V12.5L4.99992 10H2.49992ZM17.4999 15C18.4166 15 19.1666 14.25 19.1666 13.3333V9.16667C19.1666 8.25 18.4166 7.5 17.4999 7.5H12.4999V8.33333C12.4999 10.1667 10.9999 11.6667 9.16659 11.6667V13.3333C9.16659 14.25 9.91659 15 10.8333 15H12.4999V17.5L14.9999 15H17.4999Z'
        fill='white'
      />
    </svg>
  );
};

const AddCoinIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M10.3282 3.71133C8.93756 3.70898 7.19537 4.14844 5.47662 5.04297C3.7606 5.9375 2.40045 7.10938 1.60201 8.25391C0.80318 9.39453 0.587165 10.457 0.980134 11.2148C1.37349 11.9688 2.36802 12.4023 3.76216 12.4023C5.15631 12.4063 6.89849 11.9648 8.61334 11.0742C10.3321 10.1797 11.6915 9.00391 12.4883 7.86328C13.2891 6.72266 13.5001 5.66016 13.1094 4.90234C12.7149 4.14844 11.7227 3.71133 10.3282 3.71133V3.71133ZM13.918 6.45703C13.7813 7.05469 13.4844 7.66797 13.0665 8.26563C12.1836 9.52734 10.7422 10.7578 8.93756 11.6953C7.13287 12.6367 5.30084 13.1094 3.76177 13.1094C3.03521 13.1094 2.36177 13 1.7942 12.7695L2.20787 13.5664C2.60162 14.3242 3.59341 14.7578 4.98834 14.7578C6.38287 14.7578 8.12506 14.3203 9.8399 13.4258C11.5586 12.5352 12.918 11.3594 13.7149 10.2148C14.5118 9.07422 14.7305 8.01172 14.336 7.25781L13.918 6.45703ZM15.043 7.11328C15.4805 8.15625 15.129 9.42578 14.293 10.6172C13.5547 11.6758 12.4258 12.7031 11.0274 13.5625C11.461 13.6094 11.9141 13.6328 12.3751 13.6328C14.3086 13.6328 16.0586 13.2187 17.293 12.5742C18.5313 11.9297 19.211 11.0859 19.211 10.2344C19.211 9.38281 18.5313 8.53906 17.293 7.89453C16.6641 7.56641 15.8985 7.29688 15.043 7.11328V7.11328ZM19.211 11.9883C18.8126 12.4531 18.2657 12.8633 17.6211 13.1992C16.254 13.9102 14.4102 14.3359 12.3751 14.3359C11.5469 14.3359 10.7501 14.2656 10.004 14.1328C9.09771 14.5898 8.18756 14.9297 7.31256 15.1523C7.35943 15.1797 7.40631 15.2031 7.45709 15.2305C8.69146 15.875 10.4415 16.2891 12.3751 16.2891C14.3086 16.2891 16.0586 15.875 17.293 15.2305C18.5313 14.5859 19.211 13.7422 19.211 12.8906V11.9883Z'
        fill='white'
      />
    </svg>
  );
};

const LogoutIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        fillRule='evenodd'
        clipRule='evenodd'
        d='M8.99667 1.87C10.5442 1.52167 11.6667 2.85167 11.6667 4.16667V15.8333C11.6667 17.1483 10.5442 18.4783 8.99667 18.13C5.27833 17.2933 2.5 13.9717 2.5 10C2.5 6.02834 5.27833 2.70667 8.99667 1.87V1.87ZM13.5775 6.91083C13.7338 6.75461 13.9457 6.66685 14.1667 6.66685C14.3876 6.66685 14.5996 6.75461 14.7558 6.91083L17.2558 9.41084C17.4121 9.56711 17.4998 9.77903 17.4998 10C17.4998 10.221 17.4121 10.4329 17.2558 10.5892L14.7558 13.0892C14.5987 13.241 14.3882 13.325 14.1697 13.3231C13.9512 13.3212 13.7422 13.2335 13.5877 13.079C13.4331 12.9245 13.3455 12.7155 13.3436 12.497C13.3417 12.2785 13.4257 12.068 13.5775 11.9108L14.655 10.8333H7.5C7.27899 10.8333 7.06702 10.7455 6.91074 10.5893C6.75446 10.433 6.66667 10.221 6.66667 10C6.66667 9.77899 6.75446 9.56703 6.91074 9.41075C7.06702 9.25447 7.27899 9.16667 7.5 9.16667H14.655L13.5775 8.08917C13.4213 7.93289 13.3335 7.72097 13.3335 7.5C13.3335 7.27903 13.4213 7.06711 13.5775 6.91083V6.91083Z'
        fill='white'
      />
    </svg>
  );
};

const CrossIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M4.85339 3.02666L10.0001 8.17333L15.1201 3.05333C15.2331 2.93295 15.3694 2.83666 15.5206 2.77021C15.6718 2.70377 15.8349 2.66855 16.0001 2.66666C16.3537 2.66666 16.6928 2.80714 16.9429 3.05719C17.1929 3.30724 17.3334 3.64638 17.3334 4C17.3365 4.16347 17.3062 4.32585 17.2443 4.47717C17.1824 4.6285 17.0902 4.76558 16.9734 4.88L11.7867 10L16.9734 15.1867C17.1931 15.4017 17.322 15.6928 17.3334 16C17.3334 16.3536 17.1929 16.6928 16.9429 16.9428C16.6928 17.1929 16.3537 17.3333 16.0001 17.3333C15.8301 17.3404 15.6606 17.312 15.5022 17.25C15.3438 17.1881 15.2001 17.0938 15.0801 16.9733L10.0001 11.8267L4.86672 16.96C4.75406 17.0764 4.61947 17.1693 4.47072 17.2333C4.32197 17.2974 4.16201 17.3314 4.00005 17.3333C3.64643 17.3333 3.30729 17.1929 3.05725 16.9428C2.8072 16.6928 2.66672 16.3536 2.66672 16C2.66361 15.8365 2.69394 15.6741 2.75585 15.5228C2.81775 15.3715 2.90993 15.2344 3.02672 15.12L8.21339 10L3.02672 4.81333C2.80697 4.59834 2.67811 4.30721 2.66672 4C2.66672 3.64638 2.8072 3.30724 3.05725 3.05719C3.30729 2.80714 3.64643 2.66666 4.00005 2.66666C4.32005 2.67066 4.62672 2.8 4.85339 3.02666Z'
        fill='white'
      />
    </svg>
  );
};

const NavIcon = () => {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M2.5 4.6875C2.5 4.43886 2.59877 4.2004 2.77459 4.02459C2.9504 3.84877 3.18886 3.75 3.4375 3.75H16.5625C16.8111 3.75 17.0496 3.84877 17.2254 4.02459C17.4012 4.2004 17.5 4.43886 17.5 4.6875C17.5 4.93614 17.4012 5.1746 17.2254 5.35041C17.0496 5.52623 16.8111 5.625 16.5625 5.625H3.4375C3.18886 5.625 2.9504 5.52623 2.77459 5.35041C2.59877 5.1746 2.5 4.93614 2.5 4.6875V4.6875ZM2.5 9.6875C2.5 9.43886 2.59877 9.2004 2.77459 9.02459C2.9504 8.84877 3.18886 8.75 3.4375 8.75H16.5625C16.8111 8.75 17.0496 8.84877 17.2254 9.02459C17.4012 9.2004 17.5 9.43886 17.5 9.6875C17.5 9.93614 17.4012 10.1746 17.2254 10.3504C17.0496 10.5262 16.8111 10.625 16.5625 10.625H3.4375C3.18886 10.625 2.9504 10.5262 2.77459 10.3504C2.59877 10.1746 2.5 9.93614 2.5 9.6875V9.6875ZM2.5 14.6875C2.5 14.4389 2.59877 14.2004 2.77459 14.0246C2.9504 13.8488 3.18886 13.75 3.4375 13.75H16.5625C16.8111 13.75 17.0496 13.8488 17.2254 14.0246C17.4012 14.2004 17.5 14.4389 17.5 14.6875C17.5 14.9361 17.4012 15.1746 17.2254 15.3504C17.0496 15.5262 16.8111 15.625 16.5625 15.625H3.4375C3.18886 15.625 2.9504 15.5262 2.77459 15.3504C2.59877 15.1746 2.5 14.9361 2.5 14.6875V14.6875Z'
        fill='white'
      />
    </svg>
  );
};
