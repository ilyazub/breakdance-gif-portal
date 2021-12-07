import React, { useCallback, useState } from "react";

function GifItem({ userAddress, gifLink, upvotes, handleUpvote, handleTip }) {
  const [tipValue, setTipValue] = useState(1.337);

  const onClick = useCallback(async (event) => {
    handleUpvote(gifLink);
  }, []);

  const onClickTip = useCallback(
    async (event) => {
      handleTip(userAddress, tipValue);
    },
    [userAddress, tipValue]
  );

  const onTipValueChange = useCallback(async (event) => {
    event.preventDefault();
    setTipValue(Number.parseFloat(event.target.value));
  }, []);

  return (
    <div className="gif-item">
      <span className="gif-address-text">
        Added by {userAddress.toString()}
      </span>
      <img src={gifLink} alt={gifLink} />

      <div className="buttons">
        <p
          className="button"
          onClick={onClick}
          title={`${upvotes.toString()} upvotes`}
        >
          {upvotes.toString()} &#x2B06;
        </p>
        <p className="button">
          Tip <input placeholder={tipValue} onChange={onTipValueChange} /> SOL
          <input
            type="button"
            value="&#x1F4B0;"
            onClick={onClickTip}
            required
          />
        </p>
      </div>
    </div>
  );
}

export { GifItem };
export default GifItem;
