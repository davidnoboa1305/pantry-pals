'use server'

export async function getShoppingLists() {
    return [
        { id: "1", list_name: "Weekly Groceries" },
        { id: "2", list_name: "Target Run" },
        { id: "3", list_name: "Party Supplies" },
    ];
}

export async function getListDetails(id: string) {
    const lists = {
        "1": { id: "1", list_name: "Weekly Groceries", items: ["Milk", "Eggs", "Bread"] },
        "2": { id: "2", list_name: "Target Run", items: ["Paper Towels", "Soap"] },
        "3": { id: "3", list_name: "Party Supplies", items: ["Chips", "Soda", "Dip"] },
    };
    return lists[id as keyof typeof lists] || null;
}