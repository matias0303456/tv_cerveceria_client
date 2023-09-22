import toast from "react-hot-toast";

export function successToast(text) {
    toast.success(text, {
        position: 'bottom-right',
        style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
        },
        iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
        }
    })
}

export function errorToast(text) {
    toast.error(text, {
        position: 'bottom-right',
        style: {
            border: '1px solid #713200',
            padding: '16px',
            color: '#713200',
        },
        iconTheme: {
            primary: '#713200',
            secondary: '#FFFAEE',
        }
    })
}