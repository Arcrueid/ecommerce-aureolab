export const Hero = () => {
  return (
    <section className="container mx-auto flex items-center justify-center gap-2 bg-[#161b1e]">
      <div className="relative aspect-[2362/899]">
        <img
          src="/hero.webp"
          alt="Limited Offer"
          className="h-auto min-h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </section>
  );
};
