package vn.infodation.intern.group1.mas.domain;

import javax.annotation.Generated;
import javax.persistence.metamodel.SetAttribute;
import javax.persistence.metamodel.SingularAttribute;
import javax.persistence.metamodel.StaticMetamodel;

@Generated(value = "org.hibernate.jpamodelgen.JPAMetaModelEntityProcessor")
@StaticMetamodel(EquipmentGroup.class)
public abstract class EquipmentGroup_ {

	public static volatile SetAttribute<EquipmentGroup, Equipment> equipment;
	public static volatile SingularAttribute<EquipmentGroup, Long> id;
	public static volatile SingularAttribute<EquipmentGroup, String> equipmentGroupName;

	public static final String EQUIPMENT = "equipment";
	public static final String ID = "id";
	public static final String EQUIPMENT_GROUP_NAME = "equipmentGroupName";

}

