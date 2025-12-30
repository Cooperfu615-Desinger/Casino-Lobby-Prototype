import { useUI, ModalType } from '../context/UIContext';
import TransferModal from './TransferModal';
import PaymentModal from './PaymentModal';
import HistoryModal from './HistoryModal';
import SaleModal from './SaleModal';
import TournamentModal from './TournamentModal';
// Import other modals here as needed
// import BankInterface from './BankInterface'; // Example if we modalize it

const MODAL_REGISTRY: Partial<Record<ModalType, React.ComponentType<any>>> = {
    transfer: TransferModal,
    payment: PaymentModal,
    history: HistoryModal,
    sale: SaleModal,
    tournament: TournamentModal,
    bank: () => null, // Placeholder
    settings: () => null, // Placeholder
    none: () => null
};

const ModalContainer = () => {
    const { modalStack, closeModal } = useUI();

    if (modalStack.length === 0) return null;

    return (
        <>
            {modalStack.map((item, index) => {
                const Component = MODAL_REGISTRY[item.type];
                if (!Component) return null;

                const zIndex = 1000 + index * 10;

                return (
                    <div
                        key={item.id}
                        className="fixed inset-0 pointer-events-none" // pointer-events-none ensures the wrapper doesn't block interactions if the child isn't full screen, but TransferModal IS full screen. 
                        // Actually, if we use pointer-events-none, the child MUST have pointer-events-auto.
                        // Safe bet: just fixed inset-0.
                        style={{ zIndex }}
                    >
                        {/* 
                            We rely on the Modal Component itself (like TransferModal) 
                            or we wrap it in a pointer-events-auto block.
                            Since TransferModal is `fixed inset-0` internally, putting it here inside another fixed div works fine 
                            due to Stacking Context creation. 
                            However, TransferModal's internal `fixed` might fight with this wrapper IF we don't handle it carefully.
                            
                            Wait, simple wrapper "fixed inset-0" with z-index enables the stacking.
                            The child TransferModal is also "fixed inset-0".
                            So they perfectly overlap.
                            The z-index on THIS wrapper governs the z-index of the whole subtree relative to siblings (other modals).
                          */}
                        <div className="w-full h-full pointer-events-auto">
                            <Component {...item.props} onClose={closeModal} />
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ModalContainer;
