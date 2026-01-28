import { HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React from "react";

export default function SortableItem({ children, props }: any) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
    rect,
  } = useSortable({ id: props.id, disabled: props.disabled });
  const dragRect = rect.current;

  const shouldDisplayDragPlaceholder = isDragging && dragRect;
  const style = React.useMemo(() => {
    let styles: React.CSSProperties | undefined = undefined;

    styles = {
      transform: CSS.Translate.toString(transform),
      transition: transition || undefined,
    };

    if (shouldDisplayDragPlaceholder) {
      styles = {
        ...(styles || {}),
        width: dragRect?.width,
        height: dragRect?.height,
      };
    }

    return styles;
  }, [transform, transition, shouldDisplayDragPlaceholder, dragRect]);

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {!props.disabled && (
        <div
          {...attributes}
          {...listeners}
          className=" absolute top-5 right-5 cursor-grab z-200"
        >
          <HolderOutlined />
        </div>
      )}
      {children}
    </div>
  );
}
