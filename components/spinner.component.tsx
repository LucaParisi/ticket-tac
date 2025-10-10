import Image from "next/image";
import SPINNER_ICON from '@/public/icons/outline/primary/spinner.png';

type Props = Readonly<{
    visible: boolean,
}>
export function Spinner({visible}: Props) {
    return (
        <div
            className={`base-modal-container spinner-z ${
                visible ? "modal-visible" : "modal-invisible"
            }`}
        >
            {visible &&
                <div className="shadow-2xl z-50 w-full h-full">
                    <div className="flex justify-center items-center h-screen">
                        <Image className="animate-spin" src={SPINNER_ICON} alt="Caricament" width={90} height={90}/>
                    </div>
                </div>
            }
        </div>
)
}