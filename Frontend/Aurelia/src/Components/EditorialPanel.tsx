
export const EditorialPanel = ({ role }: { role: "MANAGER" | "USER" }) => {
  return (
    <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-aurelia-black">
      <div
        className="absolute inset-0 bg-cover bg-center grayscale contrast-[1.1]"
        style={{
          backgroundImage: `${role == "MANAGER" ? "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')" : "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDG9Beusy6U2N4kCXwucR16v1tVHQRIZ6kV0nnXFqlscelWycFWZ3sWK6oxTjJPCy50ADxdoROBuBmzVeZ8oGjrR_9l9P0OtHOdrSAWaUGrdA0jMfjmq1ZQC-4EVIsWmZu7pA2tYN2qppGJrebUf9U2sp8It3VS6onzQFzWhJYpMNkiti8_EEy3AHSOfpYpyz45JdVxnr4tHkQZoEskjCBzdKeg-0oVd5yyOGVp00Glgh_nL5e0PURVe7il3ejmku7Oq8T50mj1fGtW')"}`,
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/5" />
      <div className="absolute bottom-12 left-12">
        <p className="text-white text-[10px] tracking-[0.4em] uppercase font-light opacity-60">
          Collection No. 04
        </p>
      </div>
    </div>
  );
};
