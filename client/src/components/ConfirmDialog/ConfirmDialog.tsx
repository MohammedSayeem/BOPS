import React from 'react';

import './ConfirmDialog.scss';

export interface ModalProps {
  onConfirm: (args: any) => any;
  show: boolean;
  onExit: (args: any) => any;
  header: string;
  main: string;
}
export const defaultDialogValues: ModalProps = {
  header: '',
  main: '',
  onConfirm: () => {},
  onExit: () => {},
  show: false,
};
export const ConfirmDialog: React.FC<ModalProps> = ({
  onConfirm,
  onExit,
  show,
  header,
  main,
}) => {
  return !show ? null : (
    <div
      className={`modal ${show ? 'show' : ''}`}
      onClick={(e) => {
        const modal = e.currentTarget;
        modal.classList.add('shake');
        setTimeout(() => {
          modal.classList.remove('shake');
        }, 500);
      }}
    >
      <div className='modal-content' onClick={(e) => e.stopPropagation()}>
        <div className='modal-header'>
          <span>{header}</span>
          <button onClick={onExit}>x</button>
        </div>
        <div className='modal-main'>
          <span>{main}</span>
        </div>
        <div className='modal-footer'>
          <button onClick={onConfirm} className='confirm'>
            Confirm
          </button>
          <button onClick={onExit} className='cancel'>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
