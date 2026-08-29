type AmbientParticlesProps = {
  tone: string;
  enabled: boolean;
};

export const AmbientParticles = ({ tone, enabled }: AmbientParticlesProps) => {
  if (!enabled) {
    return null;
  }

  return <div className="ambient" data-tone={tone} aria-hidden="true" />;
};
