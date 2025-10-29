import { StyleSheet, Text, View } from '@react-pdf/renderer'
import React from 'react'

export const SpecificationRow = ({ label, value}) => {
  return (
     <View style={styles.row}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>
               {Array.isArray(value) ? value.join(' / ') : value}
          </Text>
     </View>
  )
}

const styles = StyleSheet.create({
     
     row: {
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
          paddingVertical: 1,
     },

     label: {
          flex: 1,
          fontSize: 8,
          color: '#666',
          fontWeight: '500',
     },

     value: {
          flex: 1,
          fontSize: 8,
          color: '#333',
     },
})
