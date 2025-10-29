import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import React, { Fragment } from "react";
import { cn } from "../../utils/utils";

export const Modal = ({
  open,
  setOpen,
  title,
  actions,
  footer,
  children,
  withBackground,
  width = "max-w-2xl",
}) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={() => {}} className="relative z-[1000]">
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-250"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-600/30 backdrop-blur-[6px]" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-5 overflow-y-auto">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-250"
            enterFrom="opacity-0 translate-y-3"
            enterTo="opacity-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-3"
          >
            <DialogPanel
              className={cn(
                `relative w-full ${width} rounded-md border border-white/60 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.12),0_8px_32px_-4px_rgba(0,0,0,0.08)] max-h-[calc(100vh-40px)] flex flex-col overflow-hidden backdrop-blur-xl bg-white/60 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/70 before:to-white/30 before:backdrop-blur-xl before:pointer-events-none`,
                "[--glass-highlight:linear-gradient(120deg,rgba(255,255,255,0.6),rgba(255,255,255,0.25)_60%)]"
              )}
            >
              {/* Subtle inner hairline & highlight */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 rounded-md border border-white/40 mix-blend-overlay" />
                <div className="absolute -top-1/2 left-1/4 w-1/2 h-[160%] bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-40 blur-2xl" />
              </div>

              <div className="flex items-center justify-between px-5 py-4 flex-shrink-0 relative z-10">
                <Dialog.Title className="text-[1.25rem] font-semibold tracking-tight text-gray-800 select-none">
                  {title}
                </Dialog.Title>
                <section className="flex items-end gap-3">
                  <section className="modal-actions gap-2 flex items-end">
                    {actions?.map((action, index) => {
                      if (!action) return null;
                      const compactClasses =
                        "!h-8 !px-3 !py-1.5 !text-xs !w-auto rounded-md !font-medium shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed";
                      return (
                        <div key={index} className="shrink-0">
                          {React.isValidElement(action)
                            ? React.cloneElement(action, {
                                size: action.props?.size ?? "small",
                                className: cn(
                                  "min-w-[auto] md:w-auto",
                                  action.props?.className,
                                  compactClasses
                                ),
                              })
                            : action}
                        </div>
                      );
                    })}
                  </section>
                  <button
                    type="button"
                    aria-label="Cerrar"
                    onClick={() => setOpen(false)}
                    className="group p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-white/70 active:scale-95 transition-all backdrop-blur focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
                  >
                    <X className="h-5 w-5 stroke-[1.5]" />
                  </button>
                </section>
              </div>

              {/* Divider (subtle) */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 p-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/40 scrollbar-track-transparent">
                {withBackground ? (
                  <section className="flex flex-col gap-4 rounded-md p-3 bg-[#f3f4f8] backdrop-blur-lg border border-[#ebecee] shadow-inner [box-shadow:inset_0_1px_1px_0_rgba(255,255,255,0.6)]">
                    {children}
                  </section>
                ) : (
                  <>{children}</>
                )}
                {footer && (
                  <section className="flex items-center justify-center gap-6 mt-10 px-2 pb-2">
                    {footer}
                  </section>
                )}
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};
