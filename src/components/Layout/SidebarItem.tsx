import { IconSettings2 } from "@tabler/icons-react";
import { SidebarItemInfo } from "./Layout";

const SidebarItem = ({ item, active, onClick, config = false }: { item: SidebarItemInfo, active: boolean, onClick: () => void, config?: boolean }) => (
    <div className={`flex flex-row gap-3 pb-3 cursor-pointer ${active ? 'text-white' : 'hover:text-gray-400 text-gray-500'}`} onClick={onClick}>
        <div className="relative">
            {item.icon}
            {config && <div className="absolute bottom-0 right-0 bg-black rounded-lg">
                <IconSettings2 size={"0.7em"} />
            </div>}
        </div>
        {item.name}
    </div>
)

export default SidebarItem;