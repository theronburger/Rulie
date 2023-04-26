
import { useData } from 'renderer/Context';
import welcomeImage from '../../../assets/welcome.png';

export default function Welcome() {
    const { rules } = useData();
  return (
    <div className="fixed w-full h-[81%] flex flex-row items-end ">
      {rules?.length === 0 && (
        <img
          className=""
          src={welcomeImage}
          alt="Hit the + button to get started"
        />
      )}
    </div>
  );
}

