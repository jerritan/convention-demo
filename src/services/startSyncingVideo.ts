import Timeline from "./timeline";

// It's good practice to ensure that the element exists and is of the correct type before proceeding.
const video: HTMLVideoElement | null = document.getElementById(
  "video_player"
) as HTMLVideoElement;

export const startVideoSync = (duration: number): void => {
  const durationMS: number = duration * 1000;
  let activated: boolean = true;

  const timelineBG = new Timeline({
    cycleTime: durationMS,
    debug: false,
  });

  timelineBG.addEvent(
    () => {
      activated = false;
      activateBG();
    },
    0,
    null,
    "Takeover is active"
  );

  timelineBG.addEvent(
    () => {
      activated = true;
      deactivateBG();
    },
    durationMS,
    null,
    "Takeover is NOT active"
  );

  const activateBG = (): void => {
    if (!activated && video) {
      // Check if not already activated
      console.log("Activating background...");
      video.currentTime = 0;
      video
        .play()
        .catch((error) => console.error("Error playing the video:", error));
      activated = true; // Set as activated
    }
  };

  const deactivateBG = (): void => {
    if (activated && video) {
      // Check if currently activated
      console.log("Deactivating background...");
      video.pause();
      activated = false; // Set as deactivated
    }
    timelineBG.reset();
  };
};
