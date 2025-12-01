import Modal from 'react-modal'
import { IoClose } from 'react-icons/io5'

Modal.setAppElement('#root');

const customStyles = {
    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1000 },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'transparent',
        border: 'none',
        padding: 0,
        width: 'auto',
        maxWidth: '100%',
        overflow: 'visible'
    }
};

export default function BaseModal({ isOpen, onClose, title, subtitle, children }) {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel={title}
        >
            <div className="w-[95vw] md:w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-[#313141] text-gray-800 dark:text-white p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-2xl relative transition-all custom-scrollbar">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors bg-white dark:bg-[#313141] rounded-full p-1"
                >
                    <IoClose size={24} />
                </button>

                {title && (
                    <h2 className="text-xl font-bold mb-1 text-yellow-600 dark:text-yellow-400 pr-8">
                        {title}
                    </h2>
                )}

                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {subtitle}
                    </p>
                )}

                {children}

            </div>
        </Modal>
    );
}