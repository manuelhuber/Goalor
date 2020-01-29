import React, {useEffect, useRef, useState} from "react";
import styled, {css} from "styled-components";

const blowUpDuration = 350;

type Props = { src: string }
const PopupImage: React.FC<Props> = props => {
    const [blowUp, setBlowUp] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);
    const [rect, setRect] = useState({top: 0, left: 0, right: 0, bottom: 0});
    const previewRef = useRef<HTMLDivElement>(null);

    function updatePreviewPosition() {
        if (!previewRef.current) return;
        let bounds = previewRef.current.getBoundingClientRect();
        setRect({
            top: bounds.top,
            bottom: window.innerHeight - bounds.bottom,
            left: bounds.left,
            right: window.innerWidth - bounds.right
        })
    }

    function startBlowup() {
        updatePreviewPosition();
        setBlowUp(true);
    }

    useEffect(() => {
        if (!blowUp) return;
        // When we blowUp we render the fullscreen image directly on top of the preview
        // Then we render again with isFullscreen which causes CSS animations to neatly blow up the image to fullscreen
        setTimeout(() => {
            setFullscreen(true);
        }, 50);
    }, [blowUp]);

    useEffect(() => {
        if (isFullscreen) return;
        // If we leave fullscreen leave some time for the animation to finish
        setTimeout(() => setBlowUp(false), blowUpDuration);
    }, [isFullscreen]);


    return <div>
        <div ref={previewRef} onClick={startBlowup}>
            <img src={props.src} alt=""/>
        </div>
        {blowUp && <Backdrop isFullscreen={isFullscreen}/>}
        {blowUp && <Fullscreen top={rect.top}
                               left={rect.left}
                               right={rect.right}
                               bottom={rect.bottom}
                               isFullscreen={isFullscreen}
                               onClick={() => setFullscreen(false)}>
            <Image src={props.src} alt=""/>
        </Fullscreen>}
    </div>;
};

const Backdrop = styled.div<{ isFullscreen: boolean }>`
  position: absolute;
  z-index: 9;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: transparent;
  transition: all 500ms ease;
  ${p => p.isFullscreen && css`background: black`}
`;
const Fullscreen = styled.div<{ top: number, bottom: number, left: number, right: number, isFullscreen: boolean }>`
  z-index: 10;
  position: absolute;
  display: flex;
  align-items: center;
  top: ${p => p.isFullscreen ? 0 : p.top}px;
  bottom: ${p => p.isFullscreen ? 0 : p.bottom}px;
  left: ${p => p.isFullscreen ? 0 : p.left}px;
  right: ${p => p.isFullscreen ? 0 : p.right}px;
  transition: all ${blowUpDuration}ms ease;
`;

const Image = styled.img`
max-width: 100%;
max-height: 100%;
margin: 0 auto;
`;
export default PopupImage;
