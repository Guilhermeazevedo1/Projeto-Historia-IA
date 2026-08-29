type AnimatedQuestionProps = {
  clear?: boolean;
  children: string;
};

export const AnimatedQuestion = ({ clear = false, children }: AnimatedQuestionProps) => (
  <h1 className="question-mark" data-clear={clear}>
    {children}
  </h1>
);
