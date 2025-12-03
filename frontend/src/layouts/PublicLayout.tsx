import Logo from '@assets/white-logo.svg';
import CondoIA from '@assets/condoIA.png';
import { Outlet } from 'react-router';

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between w-full
                    bg-[linear-gradient(50deg,black_70%,white_90%)] p-2">
      <div className='flex justify-around w-full mt-10'>
        <div className='flex flex-col space-y-4 p-4'>
          <div className="font-sans text-4xl font-semibold text-white flex flex-col items-start">
            <div className="flex items-center gap-4">
              <img src={Logo} alt="logo" className="w-16 h-16" />
              <h1>Condo</h1>
            </div>
            <h1 className="ml-32">
              <span className="text-secondary">I</span>ntelligence
            </h1>
          </div>
          <img src={CondoIA} alt='condoIntelligence' />
        </div>

        <div className='flex flex-col items-center justify-center py-4'>
          <Outlet/>
        </div>
      </div>
      <footer className="w-full text-center py-4">
        <h1 className='text-white text-sm'>Todos Direitos Reservados</h1>
      </footer>
    </div>
  );
};

export default PublicLayout;
