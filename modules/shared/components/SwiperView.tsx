import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { SwiperFlatList } from 'react-native-swiper-flatlist';

import { makeStyles } from '~/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    flex: 1,
  },
  segmentBarContainer: {
    paddingVertical: theme.dimensions.spacing(),
  },
  segmentBar: {
    paddingHorizontal: theme.dimensions.spacing(),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  screenContainer: {
    display: 'flex',
    width: theme.viewport.width,
  },
}));

type SwiperPageItem = {
  label: string;
  value: string;
};

type SwiperViewProps = {
  activeItem: string;
  items: SwiperPageItem[];
  onChangeActiveItem: (item: string) => void;
  renderScreen: (item: SwiperPageItem, index: number) => React.ReactElement;
};

export function SwiperView({ activeItem, items, onChangeActiveItem, renderScreen }: SwiperViewProps) {
  const styles = useStyles();
  const scrollRef = useRef<ScrollView>(null);
  const swiperRef = useRef<SwiperFlatList>(null);

  const onChangeActiveSegment = (value: string) => {
    onChangeActiveItem(value);
    const index = items.findIndex((item) => item.value === value);
    swiperRef.current?.scrollToIndex({ index });
    scrollRef.current?.scrollTo({ x: index * 96, y: 0, animated: true });
  }

  const onChangeIndex = (input: {index: number}) => {
    onChangeActiveSegment(items[input.index].value);
  };

  return items.length === 0 ? null : (
    <View style={styles.root}>
      <View style={styles.segmentBarContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          nestedScrollEnabled
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.segmentBar}
        >
          <SegmentedButtons
            buttons={items}
            value={activeItem}
            onValueChange={onChangeActiveSegment}
          />
        </ScrollView>
      </View>
      <SwiperFlatList
        ref={swiperRef}
        autoplay={false}
        data={items}
        onChangeIndex={onChangeIndex}
        renderItem={({ item, index }) => (
          <View key={index} style={styles.screenContainer}>
            {renderScreen(item, index)}
          </View>
        
        )}
      />
    </View>
  );
}