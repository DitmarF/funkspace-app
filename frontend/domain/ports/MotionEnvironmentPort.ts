export type SystemMotion = "reduce" | "no-preference" | "unavailable";

export type MotionEnvironment = Readonly<{
  systemMotion: SystemMotion;
  documentVisible: boolean;
}>;

/** Attach before sampling. Never deliver onChange synchronously during observe. */
export interface MotionEnvironmentPort {
  observe(onChange: (value: MotionEnvironment) => void): {
    current: MotionEnvironment;
    unsubscribe(): void;
  };
}
