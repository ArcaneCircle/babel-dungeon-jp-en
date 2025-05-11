import { useState } from "react";

import { clickSfx } from "~/lib/sounds";
import { getSFXEnabled } from "~/lib/storage";

import PixelatedImgIcon from "~/components/icons/PixelatedImgIcon";

import rotateURL from "@img/rotate.png";

export default function Meanings({ meanings }: { meanings: string[] }) {
  const [index, setIndex] = useState(0);
  const count = meanings.length;
  const onSwitch = () => {
    if (getSFXEnabled()) clickSfx.play();
    setIndex((index) => (index + 1) % count);
  };
  const fontSize = meanings[index].length > 80 ? "0.9em" : undefined;

  return (
    <div>
      <span className="selectable" style={{ fontSize }}>
        {meanings[index]}
      </span>{" "}
      {count > 1 ? (
        <button
          onClick={onSwitch}
          style={{
            background: "#dddddd",
            color: "black",
            borderRadius: "5px",
            border: "none",
            padding: "0.4em",
            fontWeight: "bold",
            marginTop: "0.3em",
          }}
        >
          [{index + 1}/{count}]
          <PixelatedImgIcon
            src={rotateURL}
            style={{ height: "1.5em", width: "auto" }}
          />
        </button>
      ) : (
        ""
      )}
    </div>
  );
}
