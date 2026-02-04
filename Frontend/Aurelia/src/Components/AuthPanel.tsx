
import { LoginForm } from './LoginForm';


export const AuthPanel = ({type}:{type:string}) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 sm:px-12 md:px-24 xl:px-48 bg-white min-h-screen">
      <div className="w-full max-w-[400px] flex flex-col animate-fadeIn">
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight mb-2 text-aurelia-black">
            Aurelia
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-aurelia-gray">
            Private Client Access
          </p>
        </div>

        <LoginForm type={type} />
        <div className="mt-24 space-y-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-[11px] text-aurelia-gray">
              New to the house of Aurelia?
            </p>
            <a 
              href="#request-membership" 
              className="text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-60 transition-opacity text-aurelia-black"
            >
              Request Membership
            </a>
          </div>

          <div className="flex justify-center gap-8 text-[9px] uppercase tracking-[0.2em] text-aurelia-gray pt-12">
            <a href="#privacy" className="hover:text-black transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-black transition-colors">Terms</a>
            <a href="#concierge" className="hover:text-black transition-colors">Concierge</a>
          </div>
        </div>

      </div>
    </div>
  );
};