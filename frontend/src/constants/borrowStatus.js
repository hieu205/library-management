/**
 * Nhãn & style badge trạng thái phiếu mượn — dùng chung admin và người dùng.
 * Giá trị status khớp backend: PENDING, BORROWING, RETURNED, REJECTED.
 */
export const BORROW_RECORD_STATUS_LABELS = {
    PENDING: 'Chờ duyệt',
    BORROWING: 'Đang mượn',
    RETURNED: 'Đã trả',
    REJECTED: 'Đã từ chối',
    APPROVED: 'Đã duyệt',
};

export const BORROW_RECORD_STATUS_BADGE_CLASS = {
    PENDING: 'badge-purple',
    BORROWING: 'badge-orange',
    RETURNED: 'badge-green',
    REJECTED: 'badge-red',
    APPROVED: 'badge-blue',
};

/** Thứ tự hiển thị trong bộ lọc admin */
export const BORROW_RECORD_STATUS_FILTER_ORDER = ['PENDING', 'BORROWING', 'RETURNED', 'REJECTED', 'APPROVED'];

export function getBorrowRecordStatusMeta(status) {
    const key = status == null ? '' : String(status).trim();
    const label = BORROW_RECORD_STATUS_LABELS[key] || key || '—';
    const className = BORROW_RECORD_STATUS_BADGE_CLASS[key] || 'badge-gray';
    return { label, className };
}
