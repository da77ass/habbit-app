import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from './BottomNavigationBar';

const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const DIAS = ['D','S','T','Q','Q','S','S'];
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

export default function CalendarioScreen({ navigation, themeMode, historyData }) {
  const dark = themeMode !== 'light';
  const t = dark
    ? { bg:'#121212', card:'#1E1E1E', text:'#FFFFFF', muted:'#9CA3AF', accent:'#16A085', today:'#263B36' }
    : { bg:'#F4F7FC', card:'#FFFFFF', text:'#0F141C', muted:'#6B7280', accent:'#16803D', today:'#E8F5EC' };
  const [mesAtual, setMesAtual] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [diaSelecionado, setDiaSelecionado] = useState(iso(new Date()));
  const registros = historyData?.registros || [];
  const contagens = useMemo(() => registros.reduce((acc, item) => {
    acc[item.data] = (acc[item.data] || 0) + 1;
    return acc;
  }, {}), [registros]);
  const ano = mesAtual.getFullYear();
  const mes = mesAtual.getMonth();
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const celulas = [...Array(primeiroDia).fill(null), ...Array.from({length:diasNoMes},(_,i)=>i+1)];
  while (celulas.length % 7) celulas.push(null);
  const atividadesDia = registros.filter((r) => r.data === diaSelecionado);
  const alterarMes = (delta) => setMesAtual(new Date(ano, mes + delta, 1));
  const hoje = iso(new Date());

  return (
    <View style={[styles.safe,{backgroundColor:t.bg}]}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation?.goBack?.()}><Ionicons name="chevron-back" size={25} color={t.text}/></TouchableOpacity>
            <Text style={[styles.title,{color:t.text}]}>Calendário</Text>
            <View style={{width:25}}/>
          </View>
          <View style={[styles.card,{backgroundColor:t.card}]}>
            <View style={styles.monthRow}>
              <TouchableOpacity onPress={()=>alterarMes(-1)}><Ionicons name="chevron-back" size={22} color={t.text}/></TouchableOpacity>
              <Text style={[styles.month,{color:t.text}]}>{MESES[mes]} {ano}</Text>
              <TouchableOpacity onPress={()=>alterarMes(1)}><Ionicons name="chevron-forward" size={22} color={t.text}/></TouchableOpacity>
            </View>
            <View style={styles.grid}>
              {DIAS.map((d,i)=><Text key={`w${i}`} style={[styles.weekday,{color:t.muted}]}>{d}</Text>)}
              {celulas.map((dia,i)=>{
                if(!dia) return <View key={`e${i}`} style={styles.dayCell}/>;
                const data=iso(new Date(ano,mes,dia));
                const count=contagens[data]||0;
                const selected=data===diaSelecionado;
                const isToday=data===hoje;
                return <TouchableOpacity key={data} onPress={()=>setDiaSelecionado(data)} style={[styles.dayCell, selected&&{backgroundColor:t.today,borderColor:t.accent,borderWidth:1},isToday&&!selected&&{borderWidth:1,borderColor:t.accent}]}>
                  <Text style={[styles.dayText,{color:t.text}]}>{dia}</Text>
                  {count>0&&<View style={[styles.dot,{backgroundColor:t.accent}]}/>}
                </TouchableOpacity>;
              })}
            </View>
            <Text style={[styles.legend,{color:t.muted}]}>● Dias com hábitos concluídos</Text>
          </View>
          <View style={[styles.card,{backgroundColor:t.card}]}>
            <Text style={[styles.section,{color:t.text}]}>Atividades em {diaSelecionado.split('-').reverse().join('/')}</Text>
            {atividadesDia.length===0
              ? <Text style={{color:t.muted}}>Nenhuma conclusão registrada nesta data.</Text>
              : atividadesDia.map(item=><View key={item.id} style={styles.activity}>
                  <Text style={[styles.activityName,{color:t.text}]}>{item.titulo}</Text>
                  <Text style={{color:t.muted}}>+{item.xp} XP</Text>
                </View>)}
          </View>
        </ScrollView>
        <BottomNavigationBar activeTab="Calendario" themeMode={themeMode} onTabPress={(tab)=>navigation?.navigate?.(tab)}/>
      </View>
    </View>
  );
}
const styles=StyleSheet.create({
 safe:{flex:1},container:{flex:1},content:{padding:18,paddingBottom:24,gap:16},
 header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8},
 title:{fontSize:22,fontWeight:'bold'},card:{borderRadius:18,padding:16},
 monthRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:16},
 month:{fontSize:17,fontWeight:'bold'},grid:{flexDirection:'row',flexWrap:'wrap'},
 weekday:{width:'14.2857%',textAlign:'center',fontWeight:'bold',paddingBottom:10},
 dayCell:{width:'14.2857%',height:44,alignItems:'center',justifyContent:'center',borderRadius:10,marginBottom:4},
 dayText:{fontSize:14,fontWeight:'600'},dot:{width:5,height:5,borderRadius:3,marginTop:2},
 legend:{fontSize:11,marginTop:8},section:{fontSize:16,fontWeight:'bold',marginBottom:12},
 activity:{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:'#8886'},
 activityName:{fontWeight:'600'}
});
