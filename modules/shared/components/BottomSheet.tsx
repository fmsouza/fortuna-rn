import { useEffect, useRef } from "react";
import { Pressable, StyleSheet } from "react-native";
import BaseBottomSheet, { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';

type BottomSheetProps = {
  children: React.ReactNode;
  enableScroll?: boolean;
  onClose: () => void;
  snapPoints: Array<string | number>;
  style?: any;
  visible: boolean;
};

export function BottomSheet({ children, enableScroll, onClose, snapPoints, style, visible }: BottomSheetProps) {
  const bottomSheetRef = useRef<BaseBottomSheet>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
    }
  }, [visible]);

  const BaseView = enableScroll ? BottomSheetScrollView : BottomSheetView;

  return (
    <BaseBottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose
      onClose={onClose}
      snapPoints={snapPoints}
      backdropComponent={() => (
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0}}
          onPress={() => bottomSheetRef.current?.close()}
        />
      )}
    >
      <BaseView style={StyleSheet.flatten([{ flex: 1 }, style])}>
        {children}
      </BaseView>
    </BaseBottomSheet>
  );
}