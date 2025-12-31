import { useUI, ModalType } from '../context/UIContext';
import TransferModal from './modals/TransferModal';
import PaymentModal from './modals/PaymentModal';
import HistoryModal from './modals/HistoryModal';
import SaleModal from './modals/SaleModal';
import TournamentModal from './modals/TournamentModal';
import BankInterface from './features/BankInterface';

const MODAL_REGISTRY: Partial<Record<ModalType, React.ComponentType<any>>> = {
    transfer: TransferModal,
    payment: PaymentModal,
    history: HistoryModal,
    sale: SaleModal,
    tournament: TournamentModal,
    bank: BankInterface,
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

                // Force highest z-index to ensure modals appear above everything (including ChatInterface z-[100])
                const zIndex = 9999 + index * 10;

                return (
                    <div
                        key={item.id}
                        className="fixed inset-0 pointer-events-none"
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
